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
exports.__esModule = true;
exports.cogSettings = exports.EchoActorClass = exports.ClientActorClass = void 0;
var data_pb = require("./data_pb");
var ClientActorClass = /** @class */ (function () {
    function ClientActorClass() {
        this.id = 'client';
        this.actionSpace = data_pb.ClientAction;
        this.observationSpace = data_pb.Observation;
        this.observationDelta = data_pb.Observation;
    }
    ClientActorClass.prototype.observationDeltaApply = function (observationDelta) {
        return observationDelta;
    };
    return ClientActorClass;
}());
exports.ClientActorClass = ClientActorClass;
var EchoActorClass = /** @class */ (function () {
    function EchoActorClass() {
        this.id = 'echo';
        this.actionSpace = data_pb.EchoAction;
        this.observationSpace = data_pb.Observation;
        this.observationDelta = data_pb.Observation;
    }
    EchoActorClass.prototype.observationDeltaApply = function (observationDelta) {
        return observationDelta;
    };
    return EchoActorClass;
}());
exports.EchoActorClass = EchoActorClass;
exports.cogSettings = {
    actorClasses: {
        client: ClientActorClass,
        echo: EchoActorClass
    },
    trial: {
        config: data_pb.TrialConfig
    },
    environment: {
        config: data_pb.EnvConfig,
        "class": {
            id: 'env',
            config: null,
            messageSpace: null
        }
    }
};
