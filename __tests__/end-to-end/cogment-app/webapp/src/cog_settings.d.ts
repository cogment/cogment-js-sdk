import * as data_pb from './data_pb';
declare const settings: {
    actor_classes: {
        client: {
            id: string;
            config_type: null;
            action_space: typeof data_pb.ClientAction;
            observation_space: typeof data_pb.Observation;
            observation_delta: typeof data_pb.Observation;
            observation_delta_apply_fn: (x: any) => any;
            feedback_space: null;
            message_space: null;
        };
        echo: {
            id: string;
            config_type: null;
            action_space: typeof data_pb.EchoAction;
            observation_space: typeof data_pb.Observation;
            observation_delta: typeof data_pb.Observation;
            observation_delta_apply_fn: (x: any) => any;
            feedback_space: null;
            message_space: null;
        };
    };
    trial: {
        config_type: typeof data_pb.TrialConfig;
    };
    environment: {
        config_type: typeof data_pb.EnvConfig;
    };
    env_class: {
        id: string;
        config_type: null;
        message_space: null;
    };
};
export default settings;
export declare type Settings = typeof settings;
//# sourceMappingURL=cog_settings.d.ts.map