"use strict";
/*
 *  Copyright 2021 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_pb = __importStar(require("./data_pb.js"));
var _client_class = {
    id: 'client',
    config_type: null,
    action_space: data_pb.ClientAction,
    observation_space: data_pb.Observation,
    observation_delta: data_pb.Observation,
    observation_delta_apply_fn: function (x) { return x; },
    feedback_space: null,
    message_space: null
};
var _echo_class = {
    id: 'echo',
    config_type: null,
    action_space: data_pb.EchoAction,
    observation_space: data_pb.Observation,
    observation_delta: data_pb.Observation,
    observation_delta_apply_fn: function (x) { return x; },
    feedback_space: null,
    message_space: null
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
        message_space: null
    }
};
exports.default = settings;
