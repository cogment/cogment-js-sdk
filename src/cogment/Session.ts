import {Message as GoogleMessage} from 'google-protobuf';
import {AsyncQueue} from '../lib/Utils';
import {ActorRunTrialOutput, Message as CogmentMessage} from './api/common_pb';
import {cogmentAPI, google} from './api/common_pb_2';
import {RecvEvent} from './ClientService';
import {ActorImplementation} from './Context';
import {Trial} from './Trial';
import {EventType} from './types';
import {TrialActor} from './types/TrialActor';
import {MessageBase, MessageClass} from './types/UtilTypes';

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
      throw new Error('Cannot start [${this.name}] more than once.');
    if (this.trial.ended)
      throw new Error(
        'Cannot start [${this.name}] because the trial has ended.',
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
        'Trial [${ this.trial.id}] - Session for [${this.name}]: Data posted is `None`',
      );
    }

    if (data instanceof Ending) this.trial.ending = true;
    else if (data instanceof EndingAck) this.trial.endingAck = true;

    this.dataQueue.put(data);
  };
  public async *retrieveData() {
    while (true) {
      const data = await this.dataQueue.get();
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
    const clazz = payload.constructor as MessageClass;
    //@ts-ignore
    if (!clazz.getTypeUrl()) {
      throw new Error(
        'protobuf message must have a typeUrl, attempted to send: ' +
          JSON.stringify(payload),
      );
    }

    to.forEach((dest) => {
      const message = new cogmentAPI.Message();
      const anyPB = new google.protobuf.Any();
      anyPB.value = clazz.encode(payload).finish();
      //@ts-ignore
      anyPB.type_url = clazz.getTypeUrl();

      message.payload = anyPB;
      message.tickId = -1;
      message.receiverName = dest;
      message.senderName = this.name;

      const binary = cogmentAPI.Message.encode(message).finish();
      const cogMessage = CogmentMessage.deserializeBinary(binary);

      this.postData(cogMessage);
    });
  }
}
