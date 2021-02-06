"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_pb = tslib_1.__importStar(require("./data_pb"));
var _client_class = {
    id: 'client',
    config_type: null,
    action_space: data_pb.ClientAction,
    observation_space: data_pb.Observation,
    observation_delta: data_pb.Observation,
    observation_delta_apply_fn: function (x) { return x; },
    feedback_space: null,
    message_space: null,
};
var _echo_class = {
    id: 'echo',
    config_type: null,
    action_space: data_pb.EchoAction,
    observation_space: data_pb.Observation,
    observation_delta: data_pb.Observation,
    observation_delta_apply_fn: function (x) { return x; },
    feedback_space: null,
    message_space: null,
};
var settings = {
    actor_classes: {
        client: _client_class,
        echo: _echo_class,
    },
    trial: {
        config_type: data_pb.TrialConfig,
    },
    environment: {
        config_type: data_pb.EnvConfig,
    },
    env_class: {
        id: 'env',
        config_type: null,
        message_space: null,
    },
};
exports.default = settings;
//# sourceMappingURL=cog_settings.js.map