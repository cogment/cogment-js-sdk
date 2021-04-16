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

/**
 * Static configuration for an actor class.
 */
export interface CogmentYamlActorClass {
  /**
   * Action space static configuration.
   */
  action: {
    /**
     * Full protobuf message type representing the action space of this actor.
     */
    space: string;
  };
  /**
   * Full protobuf message type representing the configuration of this actor.
   */
  config_type?: string;
  /**
   * Unique identifier for this actor. This identifier corresponds to {@link TrialActor.actorClass} and is used to
   * register actor implementations with {@link CogmentService.registerActor}.
   */
  name: string;
  /**
   * Observation space static configuration.
   */
  observation: {
    /**
     * Full protobuf message type representing the observation space of this actor.
     */
    space: string;
  };
}

/**
 * Default static configuration for a trial.
 */
export interface CogmentYamlTrialParameters {
  /**
   * List of actor slots available for registration during the trial.
   */
  actors: CogmentYamlActor[];
  /**
   * Static environment configuration.
   */
  environment: {
    /**
     * gRPC URI of the environment endpoint.
     */
    endpoint: string;
    /**
     * Custom configuration for this trial passed to {@link CogmentYaml.pre_hooks | `CogmentYaml.pre_hooks`} -
     * keys/values must match the environment's config protobuf
     * {@link CogmentYaml.environment.config_type | `CogmentYaml.environment.config_type`}.
     */
    config?: Record<string, unknown>;
  };
  /**
   * The maximum number of ticks before the trial is considered inactive and eligible for garbage collection.
   */
  max_inactivity?: number;
  /**
   * The maximum number of ticks the trial should run for.
   */
  max_steps?: number;
}

/**
 * Datalog static configuration.
 */
export interface CogmentYamlDatalog {
  /**
   * The type of connection.
   * @defaultValue grpc
   */
  type: 'grpc';
  /**
   * gRPC endpoint of the Datalog service.
   */
  url: string;
}

/**
 * Static configuration of an actor participating in a trial.
 */
export interface CogmentYamlActor {
  /**
   * The {@link CogmentYamlActorClass | `CogmentYamlActorClass`} this actor is an instance of (must match
   * {@link CogmentYamlActorClass.name | `CogmentYamlActorClass.name`}).
   */
  actor_class: string;
  /**
   * gRPC endpoint of this actor. The special value of `client` is used for connecting actors (vs. served actors).
   */
  endpoint: string;
  /**
   * Which implementation of this actor class to use. Actors may have multiple implementations. The special value of
   * `client` is used for connecting actors (vs. served actors).
   */
  implementation: string;
  /**
   * A unique name for this actor instance. This identifier is used for communication between actors using message
   * passing.
   */
  name: string;
}

/**
 * Static configuration of various entities participating in a Cogment application. This human-readable file is
 * transformed by the {@link https://github.com/cogment/cogment-cli | `cogment generate`} command into a language
 * specific module.
 */
export interface CogmentYaml {
  /**
   * Static configuration of actor classes available for participation in a trial.
   */
  actor_classes: CogmentYamlActorClass[];
  /**
   * List of arbitrary shell commands available for invocation through
   * {@link https://github.com/cogment/cogment-cli | `cogment run xyz`}
   */
  commands: Record<string, string>;
  /**
   * Datalog static configuration.
   */
  datalog?: CogmentYamlDatalog;
  /**
   * Environment static configuration.
   */
  environment: {
    /**
     * Full protobuf message type representing an environment's configuration.
     */
    config_type: string;
  };
  /**
   * User generated imports.
   */
  import: {
    /**
     * List of paths to .proto files used by application specific entities.
     */
    proto: string[];
  };
  /**
   * List of gRPC endpoints that are called in order prior to starting a trial. Pre-hooks act as a pipeline for
   * mutating a trial's configuration before it's start. Pre-hooks may additionally be used for other purposes.
   */
  pre_hooks?: string[];
  /**
   * Trial static configuration.
   */
  trial: {
    /**
     * Full protobuf message type representing a trial's configuration.
     */
    config_type: string;
  };
  /**
   * Trial specific configuration such as the actor slots available for registration, configuration for entities (eg:
   * values for an environment's configuration).
   */
  trial_params: CogmentYamlTrialParameters;
}
