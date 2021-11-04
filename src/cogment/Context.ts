import {ClientServicer} from './ClientService';
import {CogSettings, TrialActor} from './types';
import {MessageBase} from './types/UtilTypes';

export type ActorImplementation<
  ActionT extends MessageBase,
  ObservationT extends MessageBase,
> = (session: Session) => Promise<void>;

export class Context {
  private actors: Record<
    string,
    [TrialActor, ActorImplementation<MessageBase, MessageBase>]
  > = {};
  constructor(private userId: string, private cogSettings: CogSettings) {}

  public registerActor = <
    ActionT extends MessageBase,
    ObservationT extends MessageBase,
  >(
    actorConfig: TrialActor,
    actorImpl: ActorImplementation<ActionT, ObservationT>,
  ): void => {
    if (this.actors[actorConfig.name]) {
      console.warn(
        `Actor with name ${actorConfig.name} already registered, overwriting.`,
      );
    }

    this.actors[actorConfig.name] = [actorConfig, actorImpl];
  };

  joinTrial = async (trialId: string, endpoint: string, actorName: string) => {
    const servicer = new ClientServicer(this.cogSettings, endpoint);
    const initData = await servicer.join(trialId, actorName);

    if (!initData) throw new Error('initialData not received');

    if (actorName != initData.actorName)
      throw new Error(
        `Internal error: Actor name [${actorName}] requested, received: ${initData.actorName}`,
      );

    const actorImpl = this.actors[actorName][1];

    await servicer.runSession(actorImpl, initData);
  };
}
