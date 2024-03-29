/*
 *  Copyright 2021 AI Redefined Inc. <dev+cogment@ai-r.com>
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

import {MessageBase, MessageClass} from './UtilTypes';

/**
 * Generated static configuration of a Cogment actor.
 */
export interface CogSettingsActorClass {
  /**
   * Protobuf message type of this actor's action space.
   * @see {@link CogmentYamlActorClass.action.space}
   */
  actionSpace: MessageClass;
  /**
   * Protobuf message type of this actor's config type.
   * @see {@link CogmentYamlActorClass.config_type}
   */
  config?: MessageClass;
  /**
   * @see {@link CogmentYamlActorClass.name}
   */
  name: string;
  /**
   * Protobuf message type of this actor's observation delta.
   */
  observationDelta?: MessageClass;
  /**
   * Function used to transform observation deltas.
   */
  observationDeltaApply?: (x: MessageBase) => MessageBase;
  /**
   * Protobuf message type of this actor's observation space.
   * @see {@link CogmentYamlActorClass.observation.space}
   */
  observationSpace: MessageClass;
}

/**
 * Generated static configuration for a Cogment application.
 */
export interface CogSettings {
  messageUrlMap: {[messageUrl: string]: MessageClass};
  /**
   * Actor class static configuration.
   */
  actorClasses: Record<string, CogSettingsActorClass>;
  /**
   * Environment static configuration.
   */
  environment: {
    /**
     * Protobuf message type of the environment's configuration.
     */
    config?: MessageClass;
  };
  /**
   * Trial static configuration.
   */
  trial: {
    /**
     * Protobuf message type of the trial's configuration.
     */
    config: MessageClass;
  };
}
