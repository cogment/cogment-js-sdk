import { Message } from 'google-protobuf';
import * as data_pb from './data_pb';
export interface ActorClass {
    id: string;
    config?: typeof Message;
    actionSpace: typeof Message;
    observationSpace: typeof Message;
    observationDelta?: typeof Message;
    observationDeltaApply?: (x: Message) => Message;
    feedbackSpace?: typeof Message;
}
export declare class ClientActorClass implements ActorClass {
    id: string;
    actionSpace: typeof data_pb.ClientAction;
    observationSpace: typeof data_pb.Observation;
    observationDelta: typeof data_pb.Observation;
    observationDeltaApply(observationDelta: Message): Message;
}
export declare class EchoActorClass implements ActorClass {
    id: string;
    actionSpace: typeof data_pb.EchoAction;
    observationSpace: typeof data_pb.Observation;
    observationDelta: typeof data_pb.Observation;
    observationDeltaApply(observationDelta: Message): Message;
}
export declare const cogSettings: {
    actorClasses: {
        client: typeof ClientActorClass;
        echo: typeof EchoActorClass;
    };
    trial: {
        config: typeof data_pb.TrialConfig;
    };
    environment: {
        config: typeof data_pb.EnvConfig;
        class: {
            id: string;
            config: any;
            messageSpace: any;
        };
    };
};
export declare type CogSettings = typeof cogSettings;
//# sourceMappingURL=CogSettings.d.ts.map