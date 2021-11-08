import { grpc } from '@improbable-eng/grpc-web';
import { AsyncQueue, staticCastFromGoogle, streamToGenerator } from '../lib/Utils';
import { ActorSession } from './Actor';
import {
  Action,
  ActorInitialInput,
  ActorInitialOutput,
  ActorRunTrialInput,
  ActorRunTrialOutput,
  CommunicationState,
  Message,
  Reward
} from './api/common_pb';
import common_pb_2, { cogmentAPI as Common } from './api/common_pb_2';
import { ClientActorSPClient } from './api/orchestrator_pb_service';
import { ActorImplementation } from './Context';
import { _EndingAck } from './Session';
import { Trial } from './Trial';
import { CogSettings, EventType } from './types';
import { MessageBase } from './types/UtilTypes';


export class RecvEvent<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,

  >{
  public observation?: ObservationT
  public actions: ActionT[] = [];
  public rewards: Common.Reward[] = [];
  public messages: Common.Message[] = []

  constructor(public type: EventType) { }
}

const _processNormalData = <
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
  >(_data: ActorRunTrialInput, session: ActorSession<ActionT, ObservationT>) => {
  let recvEvent: RecvEvent<ActionT, ObservationT>;
  const data = _data.toObject();
  if (session._trial.ending)
    recvEvent = new RecvEvent(EventType.ENDING)
  else
    recvEvent = new RecvEvent(EventType.ACTIVE)

  if (data.observation) {
    if (session._trial.ending && session._autoAck)
      session._postData(new _EndingAck())

    session._trial.tickId = data.observation.tickId

    const obsSpace = session._actorClass.observationSpace;
    const observation = obsSpace.decode(data.observation.content)

    recvEvent.observation = observation as ObservationT;
    session._newEvent(recvEvent)
  }
  else if (data.reward) {
    const _reward = _data.getReward();
    if (!_reward) throw new Error("reward not set on source pb, this should never happen")
    const reward = staticCastFromGoogle<common_pb_2.cogmentAPI.Reward>(_reward, common_pb_2.cogmentAPI.Reward)
    recvEvent.rewards = [reward]
    session._newEvent(recvEvent)
  }
  else if (data.message) {

    const _message = _data.getMessage();
    if (!_message) throw new Error("message not set on source pb, this should never happen")
    const message = staticCastFromGoogle<common_pb_2.cogmentAPI.Message>(_message, common_pb_2.cogmentAPI.Message)

    recvEvent.messages = [message]
    session._newEvent(recvEvent)
  }
  else if (data.details)
    console.warn(`Trial [${session._trial.id}] - Actor [${session.name}] received unexpected detail data [${data.details}]`)

  else
    throw new Error(`Trial [${session._trial.id}] - Actor [${session.name}] received unexpected data [${JSON.stringify(data)}]`)

}

const _processOutgoing = async <ActionT extends MessageBase, ObservationT extends MessageBase>(dataQueue: AsyncQueue<ActorRunTrialOutput>, session: ActorSession<ActionT, ObservationT>) => {
  for await (const data of session._retrieveData()) {
    const output = new ActorRunTrialOutput()
    output.setState(CommunicationState.NORMAL)

    if (data instanceof Action)
      output.setAction(data)
    else if (data instanceof Reward)
      output.setReward(data)
    else if (data instanceof Message)
      output.setMessage(data)
    else if (data instanceof _EndingAck) {
      output.setState(CommunicationState.LAST_ACK)
      await dataQueue.put(output)
      break
    }
    else {
      console.warn(`Trial [${session._trial.id}] - Actor [{session.name}]: Unknown data type to send [{type(data)}]`)
      continue
    }

    await dataQueue.put(output)
  }
}

const _processIncoming = async <ActionT extends MessageBase, ObservationT extends MessageBase>(replyItor: AsyncGenerator<ActorRunTrialInput, void, unknown>, reqQueue: AsyncQueue<ActorRunTrialOutput>, session: ActorSession<ActionT, ObservationT>) => {
  for await (const _data of replyItor) {
    const data = _data.toObject()

    if (data.state === CommunicationState.NORMAL)
      _processNormalData(_data, session)

    else if (data.state === CommunicationState.HEARTBEAT) {
      const reply = new ActorRunTrialOutput()
      reply.setState(data.state)
      reqQueue.put(reply)
    }
    else if (data.state === CommunicationState.LAST)
      session._trial.ending = true

    else if (data.state === CommunicationState.LAST_ACK)
      throw new Error(`Trial [${session._trial.id}] - Actor [${session.name}] received an unexpected 'LAST_ACK'`)

    else if (data.state === CommunicationState.END) {
      if (session._trial.ending) {
        session._newEvent(new RecvEvent(EventType.FINAL))
      }
      else {
        let details = '';
        if (data.details)
          details = data.details
        console.warn(`Trial [${session._trial.id}] - Actor [${session.name}]: Trial ended forcefully [${details}]`)
      }
      session._trial.ended = true
      session._exitQueues()
      break
    }

    else
      throw new Error(`Trial [${session._trial.id}] - Actor [${session.name}] received an invalid state [${data.state}]`)

  }
}


export class ClientServicer<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
  > {
  private _actorStub: ClientActorSPClient;
  private _requestQueue?: AsyncQueue<ActorRunTrialOutput>;
  private _replyItor?: AsyncGenerator<ActorRunTrialInput, void, unknown>

  public trialId?: string;

  constructor(private cogSettings: CogSettings, private endpoint: string) {
    this._actorStub = new ClientActorSPClient(endpoint);
  }

  join = async (trialId: string, actorName?: string, actorClass?: string) => {
    if (this._requestQueue)
      throw new Error('ClientServicer has already joined');

    const req = new ActorRunTrialOutput();
    req.setState(CommunicationState.NORMAL);

    const init = new ActorInitialOutput();
    if (actorName) init.setActorName(actorName);
    else if (actorClass) init.setActorClass(actorClass);
    else
      throw new Error(
        'Only actor_name or actor_class must be specified, not both.',
      );

    req.setInitOutput(init);

    this._requestQueue = new AsyncQueue<ActorRunTrialOutput>();
    this._requestQueue.put(req);

    this.trialId = trialId;

    const metadata = new grpc.Metadata({ 'trial-id': trialId });

    this._replyItor = streamToGenerator(this._actorStub.runTrial(metadata))();

    for await (const replyMessage of this._replyItor) {
      const reply = replyMessage.toObject();
      if (reply.state === CommunicationState.NORMAL) {
        if (reply.initInput) return reply.initInput;
        else if (reply.details)
          console.warn(
            `Trial [${trialId}] - Received unexpected detail data [${reply.details}] while joining`,
          );
        else
          throw new Error(
            `Unexpected data [${JSON.stringify(reply)}] while joining`,
          );
      } else if (reply.state === CommunicationState.HEARTBEAT) {
        const newReply = new ActorRunTrialOutput();
        newReply.setState(reply.state);
        await this._requestQueue.put(newReply);
      } else if (reply.state === CommunicationState.LAST) {
        console.warn(
          `Trial [${trialId}] - Received 'LAST' state while joining`,
        );
        const newReply = new ActorRunTrialOutput();
        newReply.setState(CommunicationState.LAST_ACK);
        await this._requestQueue.put(newReply);
        break;
      } else if (reply.state === CommunicationState.LAST_ACK)
        throw new Error(
          `Trial [${trialId}] - Received an unexpected 'LAST_ACK' while joining`,
        );
      else if (reply.state === CommunicationState.END) {
        let details: string;
        if (reply.details) details = reply.details;
        else details = '';
        console.warn(
          `Trial [${trialId}] - Ended forcefully [${details}] while joining`,
        );
        break;
      } else
        throw new Error(
          `Received an invalid state [${reply.state}] while joining`,
        );
    }
    return;
  };

  public runSession = (impl: ActorImplementation<ActionT, ObservationT>, initData: ActorInitialInput.AsObject) => {
    if (!this._requestQueue || !this.trialId || !this._replyItor)
      throw new Error("ClientServicer has not joined")

    const trial = new Trial(this.trialId, [], this.cogSettings)
    const actorClass = this.cogSettings.actorClasses[initData.actorClass]

    let config: MessageBase | undefined = undefined;
    if (initData.config) {
      if (!actorClass.config)
        throw new Error(`Actor [${initData.actorName}] received config data of unknown type (was it defined in cogment.yaml)`)
      if (!actorClass.config) return; //Typescript nees this for some reason
      if (!initData?.config?.content) throw new Error("Content not set")
      if (initData.config.content instanceof Uint8Array) {
        config = actorClass.config.decode(initData.config.content)
      }
      else {
        throw new Error("string not expected from content decoding")
      }
    }


    if (!initData?.config?.content) throw new Error("Content not set")



    const session = new ActorSession(impl, actorClass, trial, initData.actorName, initData.envName, config)

    _processOutgoing(this._requestQueue, session)
    _processIncoming(this._replyItor, this._requestQueue, session)
    session._run();
  }
}