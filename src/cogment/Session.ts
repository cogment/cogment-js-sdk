import { Message as GoogleMessage } from 'google-protobuf';
import { AsyncQueue } from '../lib/Utils';
import { ActorRunTrialOutput, Message as CogmentMessage } from './api/common_pb';
import { cogmentAPI, google } from './api/common_pb_2';
import { RecvEvent } from './ClientService';
import { ActorImplementation } from './Context';
import { Trial } from './Trial';
import { EventType } from './types';
import { TrialActor } from './types/TrialActor';
import { MessageBase, MessageClass } from './types/UtilTypes';

export class Ending {}

export class EndingAck {}

interface constructorof<T> {
  new (): T;
}

export class Session<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
> {
  private _eventQueue = new AsyncQueue<RecvEvent<ActionT, ObservationT>>();
  private _started = false;
  private _lastEventDelivered = false;
  private _dataQueue = new AsyncQueue<
    ActorRunTrialOutput | Ending | EndingAck | GoogleMessage
  >();
  public _autoAck = true;
  private _activeActors: TrialActor[] = [];

  constructor(
    public _trial: Trial,
    public name: string,
    protected _impl: ActorImplementation<ActionT, ObservationT>,
    public config?: MessageBase,
  ) {
    this._activeActors = _trial.actors.map((actor) => ({
      name: actor.name,
      actorClass: actor.actorClass.name,
    }));
  }

  protected _start = (autoDoneSending: boolean) => {
    if (this._started)
      throw new Error('Cannot start [${this.name}] more than once.');
    if (this._trial.ended)
      throw new Error(
        'Cannot start [${this.name}] because the trial has ended.',
      );

    this._autoAck = autoDoneSending;
    this._started = true;
  };

  public _newEvent = (event: RecvEvent<ActionT, ObservationT>) => {
    if (!this._started) {
      console.warn(
        `[${this.name}] received an event before session was started.`,
      );
      return;
    }
    if (this._trial.ended) {
      console.warn(`Event received after trial is over: [${event}]`);
      return;
    }
    if (!event)
      console.warn(
        `Trial [${this._trial.id}] - Session for [${this.name}]: New event is undefined`,
      );

    this._eventQueue.put(event);
  };
  public _postData = (data: GoogleMessage | Ending | EndingAck) => {
    if (!this._started) {
      console.warn(
        `Trial [${this._trial.id}] - Session for [${this.name}]: Cannot send until session is started.`,
      );
      return;
    }
    if (this._trial.endingAck) {
      console.warn(
        `Trial [${this._trial.id}] - Session for [${this.name}]: Cannot send after acknowledging ending`,
      );
      return;
    }

    if (!data) {
      throw new Error(
        'Trial [${this._trial.id}] - Session for [${this.name}]: Data posted is `None`',
      );
    }

    if (data instanceof Ending) this._trial.ending = true;
    else if (data instanceof EndingAck) this._trial.endingAck = true;

    this._dataQueue.put(data);
  };
  public async *_retrieveData() {
    while (true) {
      const data = await this._dataQueue.get();
      if (!data) break;
      yield data;
    }
  }

  public sendingDone = () => {
    if (this._autoAck)
      throw new Error('Cannot manually end sending as it is set to automatic');
    else if (!this._trial.ending)
      throw new Error('Cannot stop sending before trial is ready to end');
    else if (this._trial.ended)
      console.warn(
        `Trial [${this._trial.id}] - Session [${this.name}] end sending ignored because the trial has already ended.`,
      );
    else if (this._trial.endingAck)
      console.warn(
        `Trial [${this._trial.id}] - Session [${this.name}] cannot end sending more than once`,
      );
    else this._postData(new EndingAck());
  };
  public async *eventLoop() {
    if (!this._started) {
      console.warn(
        `Event loop is not enabled until the [${this.name}] is started.`,
      );
      return;
    }
    if (this._trial.ended) {
      console.warn(
        `No more events for [${this.name}] because the trial has ended.`,
      );
      return;
    }
    const loopActive = !this._lastEventDelivered;
    while (loopActive) {
      const event = await this._eventQueue.get();
      if (!event) {
        this._lastEventDelivered = true;
        break;
      }

      this._lastEventDelivered = event.type == EventType.FINAL;
      yield event;
    }
  }

  public getTrialId = () => {
    return this._trial.id;
  };

  public getTickId = () => {
    return this._trial.tickId;
  };
  public isTrialOver = () => {
    return this._trial.ended;
  };

  public _exitQueues = () => {
    this._eventQueue.end();
    this._dataQueue.end();
  };

  protected _sendMessage(payload: MessageBase, to: string[]) {
    if (!this._started) {
      console.warn(
        `Trial [${this._trial.id}] - Session for [${this.name}]: Cannot send message until session is started.`,
      );
      return;
    }
    if (this._trial.endingAck) {
      console.warn(
        `Trial [${this._trial.id}] - Session for [${this.name}]: Cannot send message after acknowledging ending.`,
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

      this._postData(cogMessage);
    });
  }
}
