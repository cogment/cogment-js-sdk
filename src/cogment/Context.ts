import { CogSettings, TrialActor } from "./types";
import { MessageBase } from "./types/UtilTypes";

export type ActorImplementation<
    ActionT extends MessageBase,
    ObservationT extends MessageBase,
    > = (session: Session) => Promise<void>;

export class Context {
    private actors: Record<
        string,
        [TrialActor, ActorImplementation<MessageBase, MessageBase>]
    > = {};
    constructor(private userId: string, private cogSettings: CogSettings) {

    }

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
    }

    public serveAllRegistered = ()
}