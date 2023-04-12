import {Message as GoogleMessage} from 'google-protobuf';
import {AsyncQueue, encodePbMessage, messageToAnyPB} from '../lib/Utils';
import {
  ActorRunTrialOutput,
  Message as CogmentMessage,
  Reward,
} from './api/common_pb';
import {cogmentAPI} from './api/common_pb_2';
import {RecvEvent} from './ClientService';
import {ActorImplementation} from './Context';
import {Trial} from './Trial';
import {EventType, TrialActor, MessageBase, MessageClass} from './types';

export class Ending {}

export class EndingAck {}

interface constructorof<T> {
  new (): T;
}

export class Session<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
> {
  private eventQueue = new AsyncQueue<RecvEvent<ActionT, ObservationT>>();
  private started = false;
  private lastEventDelivered = false;
  private dataQueue = new AsyncQueue<
    ActorRunTrialOutput | Ending | EndingAck | GoogleMessage
  >();
  public autoAck = true;
  private activeActors: TrialActor[] = [];

  constructor(
    public trial: Trial,
    public name: string,
    protected impl: ActorImplementation<ActionT, ObservationT>,
    public config?: MessageBase,
  ) {
    this.activeActors = trial.actors.map((actor) => ({
      name: actor.name,
      actorClass: actor.actorClass.name,
    }));
  }

  public internalStart = (autoDoneSending: boolean) => {
    if (this.started)
      throw new Error(`Cannot start [${this.name}] more than once.`);
    if (this.trial.ended)
      throw new Error(
        `Cannot start [${this.name}] because the trial has ended.`,
      );

    this.autoAck = autoDoneSending;
    this.started = true;
  };

  public newEvent = (event: RecvEvent<ActionT, ObservationT>) => {
    if (!this.started) {
      console.warn(
        `[${this.name}] received an event before session was started.`,
      );
      return;
    }
    if (this.trial.ended) {
      console.warn(`Event received after trial is over: [${event}]`);
      return;
    }
    if (!event)
      console.warn(
        `Trial [${this.trial.id}] - Session for [${this.name}]: New event is undefined`,
      );

    this.eventQueue.put(event);
  };

  public postData = (data: GoogleMessage | Ending | EndingAck) => {
    if (!this.started) {
      console.warn(
        `Trial [${this.trial.id}] - Session for [${this.name}]: Cannot send until session is started.`,
      );
      return;
    }
    if (this.trial.endingAck) {
      console.warn(
        `Trial [${this.trial.id}] - Session for [${this.name}]: Cannot send after acknowledging ending`,
      );
      return;
    }

    if (!data) {
      throw new Error(
        `Trial [${this.trial.id}] - Session for [${this.name}]: Data posted is 'None'`,
      );
    }

    if (data instanceof Ending) this.trial.ending = true;
    else if (data instanceof EndingAck) this.trial.endingAck = true;

    //console.log("this.dataQueue.put", (data instanceof Ending) ? "ending" : (data instanceof EndingAck) ? "ending_ack" : data);
    this.dataQueue.put(data);
  };
  public async *retrieveData() {
    while (true) {
      const data = await this.dataQueue.get();
      //console.log("retrieveData", data);
      if (!data) break;
      yield data;
    }
  }

  public sendingDone = () => {
    if (this.autoAck)
      throw new Error('Cannot manually end sending as it is set to automatic');
    else if (!this.trial.ending)
      throw new Error('Cannot stop sending before trial is ready to end');
    else if (this.trial.ended)
      console.warn(
        `Trial [${this.trial.id}] - Session [${this.name}] end sending ignored because the trial has already ended.`,
      );
    else if (this.trial.endingAck)
      console.warn(
        `Trial [${this.trial.id}] - Session [${this.name}] cannot end sending more than once`,
      );
    else this.postData(new EndingAck());
  };
  public async *eventLoop() {
    if (!this.started) {
      console.warn(
        `Event loop is not enabled until the [${this.name}] is started.`,
      );
      return;
    }
    if (this.trial.ended) {
      console.warn(
        `No more events for [${this.name}] because the trial has ended.`,
      );
      return;
    }
    const loopActive = !this.lastEventDelivered;
    while (loopActive) {
      const event = await this.eventQueue.get();
      if (!event) {
        this.lastEventDelivered = true;
        break;
      }

      this.lastEventDelivered = event.type == EventType.FINAL;
      yield event;
    }
  }

  public getTrialId = () => {
    return this.trial.id;
  };

  public getTickId = () => {
    return this.trial.tickId;
  };
  public isTrialOver = () => {
    return this.trial.ended;
  };

  public exitQueues = () => {
    this.eventQueue.end();
    this.dataQueue.end();
  };

  public addReward = (
    value: number,
    confidence: number,
    to: string[],
    tickId = -1,
    userData: MessageBase | null = null,
  ) => {
    if (!this.started) {
      console.warn(
        `Trial [${this.trial.id}] - Session for [${this.name}]: Cannot send reward until session is started.`,
      );
      return;
    }
    if (this.trial.endingAck) {
      console.warn(
        `Trial [${this.trial.id}] - Session for [${this.name}]: Cannot send reward after acknowledging ending.`,
      );
      return;
    }

    to.forEach((receiverName) => {
      const reward = new cogmentAPI.Reward();
      reward.tickId = tickId;
      reward.receiverName = receiverName;
      reward.value = value;

      const rewardSource = new cogmentAPI.RewardSource();
      rewardSource.senderName = this.name;
      rewardSource.confidence = confidence;
      rewardSource.value = value;

      if (userData) {
        rewardSource.userData = messageToAnyPB(userData);
      }

      reward.sources.push(rewardSource);

      const serializedReward = encodePbMessage(cogmentAPI.Reward, reward);
      const cogReward = Reward.deserializeBinary(serializedReward);
      this.postData(cogReward);
    });
  };

  protected sendMessageInternal(payload: MessageBase, to: string[]) {
    if (!this.started) {
      console.warn(
        `Trial [${this.trial.id}] - Session for [${this.name}]: Cannot send message until session is started.`,
      );
      return;
    }
    if (this.trial.endingAck) {
      console.warn(
        `Trial [${this.trial.id}] - Session for [${this.name}]: Cannot send message after acknowledging ending.`,
      );
      return;
    }

    to.forEach((dest) => {
      const message = new cogmentAPI.Message();
      message.payload = messageToAnyPB(payload);
      message.tickId = -1;
      message.receiverName = dest;
      message.senderName = this.name;

      // Cloderic: Not sure (like not sure at all) why this is here but it was like that before
      const serializedMessage = encodePbMessage(cogmentAPI.Message, message);
      const cogMessage = CogmentMessage.deserializeBinary(serializedMessage);

      this.postData(cogMessage);
    });
  }
}
