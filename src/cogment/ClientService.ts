import {grpc} from '@improbable-eng/grpc-web';
import { Message as MessagePB } from 'google-protobuf';
import {AsyncQueue, streamToGenerator} from '../lib/Utils';
import { ActorSession } from './Actor';
import {
  Action,
  ActorInitialInput,
  ActorInitialOutput,
  ActorRunTrialInput,
  ActorRunTrialOutput,
  CommunicationState,
} from './api/common_pb';
import {ClientActorSPClient} from './api/orchestrator_pb_service';
import { ActorImplementation } from './Context';
import { Session, _EndingAck } from './Session';
import { Trial } from './Trial';
import {CogSettings, EventType} from './types';
import { MessageBase } from './types/UtilTypes';

import {cogmentAPI as Common} from "./api/common_pb_2"

export class RecvEvent<
  ObservationT extends MessageBase,
  ActionT extends MessageBase,
>{
    public observation?: ObservationT
    public actions: ActionT[] = [];
    public rewards: Common.Reward[] = [];
    public messages: Common.Message[] = []

    constructor(public type: EventType){}
}

const _processNormalData = <
    ActionT extends MessageBase, 
    ObservationT extends MessageBase, 

    >(data: ActorRunTrialOutput, session: ActorSession<ActionT, ObservationT>) => {
    let recvEvent: RecvEvent<ActionT, ObservationT>;

    if (session._trial.ending)
        recvEvent = new RecvEvent(EventType.ENDING)
    else
        recvEvent = new RecvEvent(EventType.ACTIVE)

    if (data.)
        logging.log(TRACE, f"Trial [{session._trial.id}] - Actor [{session.name}] received an observation")

        if (session._trial.ending and session._auto_ack)
            session._post_data(_EndingAck())

        session._trial.tick_id = data.observation.tick_id

        obs_space = session._actor_class.observation_space()
        obs_space.ParseFromString(data.observation.content)

        recv_event.observation = RecvObservation(data.observation, obs_space)
        session._new_event(recv_event)

    elif (data.HasField("reward"))
        logging.log(TRACE, f"Trial [{session._trial.id}] - Actor [{session.name}] received reward")

        recv_event.rewards = [RecvReward(data.reward)]
        session._new_event(recv_event)

    elif (data.HasField("message"))
        logging.log(TRACE, f"Trial [{session._trial.id}] - Actor [{session.name}] received message")

        recv_event.messages = [RecvMessage(data.message)]
        session._new_event(recv_event)

    elif (data.HasField("details"))
        logging.warning(f"Trial [{session._trial.id}] - Actor [{session.name}] "
                        f"received unexpected detail data [{data.details}]")

    else:
        logging.error(f"Trial [{session._trial.id}] - Actor [{session.name}] "
                      f"received unexpected data [{data.WhichOneof('data')}]")
}

const _processOutgoing = async <ActionT extends MessageBase>(dataQueue: AsyncQueue<ActorRunTrialOutput>, session: ActorSession<ActionT>) => {
  for await (const data of session._retrieveData()){
      const package = new ActorRunTrialOutput()
      package.setState(CommunicationState.NORMAL)

      if (data instanceof Action)
          package.setAction(data)
      else if (data instanceof Reward)
          package.setReward(data)
      else if (data instanceof Message)
          package.setMessage(data)
      else if (data instanceof _EndingAck){
          package.setState(CommunicationState.LAST_ACK)
          await dataQueue.put(package)
          break
      }
      else{
          console.warn(`Trial [${session._trial.id}] - Actor [{session.name}]: Unknown data type to send [{type(data)}]`)
          continue
      }

      await dataQueue.put(package)
  }
}

const _processIncoming = async <ActionT extends MessageBase>(replyItor: AsyncGenerator<ActorRunTrialInput, void, unknown>, reqQueue, session: ActorSession<ActionT>) => {
  for await (const _data of replyItor){
      const data = _data.toObject()

        if (data.state == common_api.CommunicationState.NORMAL)
            _process_normal_data(data, session)

        elif (data.state == common_api.CommunicationState.HEARTBEAT)
            logging.log(TRACE, f"Trial [{session._trial.id}] - Actor [{session.name}] "
                                f"received 'HEARTBEAT' and responding in kind")
            reply = common_api.ActorRunTrialOutput()
            reply.state = data.state
            await req_queue.put(reply)

        elif (data.state == common_api.CommunicationState.LAST)
            logging.debug(f"Trial [{session._trial.id}] - Actor [{session.name}] received 'LAST' state")
            session._trial.ending = True

        elif (data.state == common_api.CommunicationState.LAST_ACK)
            logging.error(f"Trial [{session._trial.id}] - Actor [{session.name}] "
                          f"received an unexpected 'LAST_ACK'")
            # TODO: Should we `return` or raise instead of continuing?

        elif (data.state == common_api.CommunicationState.END)
            if (session._trial.ending)
                if (data.HasField("details"))
                    logging.info(f"Trial [{session._trial.id}] - Actor [{session.name}]: "
                                  f"Trial ended with explanation [{data.details}]")
                else:
                    logging.debug(f"Trial [{session._trial.id}] - Actor [{session.name}]: Trial ended")
                session._new_event(RecvEvent(EventType.FINAL))
            else:
                if (data.HasField("details"))
                    details = data.details
                else:
                    details = ""
                logging.warning(f"Trial [{session._trial.id}] - Actor [{session.name}]: "
                                f"Trial ended forcefully [{details}]")

            session._trial.ended = True
            session._exit_queues()
            break

        else:
            logging.error(f"Trial [{session._trial.id}] - Actor [{session.name}] "
                          f"received an invalid state [{data.state}]")

}


export class ClientServicer {
  private _actorStub: ClientActorSPClient;
  private _requestQueue?: ActorRunTrialOutput[];
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

    this._requestQueue = [];
    this._requestQueue.push(req);

    this.trialId = trialId;

    const metadata = new grpc.Metadata({'trial-id': trialId});

    this._replyItor = streamToGenerator(this._actorStub.runTrial(metadata))();

    for await (const replyMessage of this._replyItor) {
      const reply = replyMessage.toObject();
      if (reply.state == CommunicationState.NORMAL) {
        if (reply.initInput) return reply.initInput;
        else if (reply.details)
          console.warn(
            `Trial [${trialId}] - Received unexpected detail data [${reply.details}] while joining`,
          );
        else
          throw new Error(
            `Unexpected data [${JSON.stringify(reply)}] while joining`,
          );
      } else if (reply.state == CommunicationState.HEARTBEAT) {
        const newReply = new ActorRunTrialOutput();
        newReply.setState(reply.state);
        await this._requestQueue.push(newReply);
      } else if (reply.state == CommunicationState.LAST) {
        console.warn(
          `Trial [${trialId}] - Received 'LAST' state while joining`,
        );
        const newReply = new ActorRunTrialOutput();
        newReply.setState(CommunicationState.LAST_ACK);
        await this._requestQueue.push(newReply);
        break;
      } else if (reply.state == CommunicationState.LAST_ACK)
        throw new Error(
          `Trial [${trialId}] - Received an unexpected 'LAST_ACK' while joining`,
        );
      else if (reply.state == CommunicationState.END) {
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

  public runSession = (impl: ActorImplementation<MessageBase, MessageBase>, initData: ActorInitialInput.AsObject) => {
        if (!this._requestQueue || !this.trialId):
            throw new Error("ClientServicer has not joined")

        const trial = new Trial(this.trialId, [], this.cogSettings)
        const actorClass = this.cogSettings.actorClasses[initData.actorClass]

        let config: Message | undefined = undefined;
        if (initData.config)
            if (!actorClass.config)
                throw new Error(`Actor [${initData.actorName}] received config data of unknown type (was it defined in cogment.yaml)`)
            if (!actorClass.config) return; //Typescript nees this for some reason
            config = new actorClass.config()
            if(!initData?.config?.content) throw new Error("Content not set")

            if(initData.config.content instanceof Uint8Array){
              config = actorClass.config.decode(initData.config.content)
            }
            else{
              throw new Error("string not expected from content decoding")
            }

        const session = new ActorSession(impl, actorClass, trial, initData.actorName, initData.envName, config)

        sendTask = asyncio.createTask(ProcessOutgoing(this_requestQueue, session))
        processTask = asyncio.createTask(ProcessIncoming(this_replyItor, this_requestQueue, session))
        userTask = session.StartUserTask()

        logging.debug("Trial [{session.Trial.id}] - Actor [{session.name}] session started")
        normalReturn = await userTask

        if normalReturn:
            if not session.LastEventDelivered:
                logging.warning("Trial [{session._trial.id}] - Actor [{session.name}] "
                                "user implementation returned before required")
            else:
                logging.debug("Trial [{session._trial.id}] - Actor [{session.name}] "
                            "user implementation returned")
        else:
            logging.debug("Trial [{session._trial.id}] - Actor [{session.name}] "
                        "user implementation was cancelled")


        if this._requestQueue is not None:
            await this._requestQueue.put(_EndQueue())
        if send_task is not None:
            send_task.cancel()
        if process_task is not None:
            process_task.cancel()
}
