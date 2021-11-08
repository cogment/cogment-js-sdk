import { ActorSession } from './Actor';
import { TrialLifecycleSPClient } from './api/orchestrator_pb_service';
import { ClientServicer } from './ClientService';
import { Controller } from './Control';
import { CogSettings, TrialActor } from './types';
import { MessageBase } from './types/UtilTypes';

export type ActorImplementation<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
  > = (session: ActorSession<ActionT, ObservationT>) => Promise<void>;

export class Context<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
  > {
  private actors: Record<
    string,
    [TrialActor, ActorImplementation<ActionT, ObservationT>]
  > = {};
  constructor(private cogSettings: CogSettings, private _userId = "client") { }

  public registerActor = (
    actorImpl: ActorImplementation<ActionT, ObservationT>,
    actorName: string,
    actorClass: string
  ): void => {
    if (this.actors[actorName]) {
      console.warn(
        `Actor with name ${actorName} already registered, overwriting.`,
      );
    }

    this.actors[actorName] = [{ name: actorName, actorClass }, actorImpl];
  };

  joinTrial = async (trialId: string, endpoint: string, actorName: string) => {
    const servicer = new ClientServicer<ActionT, ObservationT>(this.cogSettings, endpoint);
    const initData = await servicer.join(trialId, actorName);

    if (!initData) throw new Error('initialData not received');

    if (actorName != initData.actorName)
      throw new Error(
        `Internal error: Actor name [${actorName}] requested, received: ${initData.actorName}`,
      );

    const actorImpl = this.actors[actorName][1];

    await servicer.runSession(actorImpl, initData);
  };

  _getControlStub(endpoint: string) {
    return new TrialLifecycleSPClient(endpoint)
  }
  getController = (endpoint: string) => {
    const stub = this._getControlStub(endpoint)
    return new Controller(this.cogSettings, stub, this._userId)
  }
}
