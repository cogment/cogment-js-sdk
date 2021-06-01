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

import {grpc} from '@improbable-eng/grpc-web';
import {Message} from 'google-protobuf';
import {getLogger} from '../lib/Logger';
import {ActorSession} from './ActorSession';
import {
  TrialActionReply,
  TrialActionRequest,
  TrialListEntry,
  TrialListRequest,
} from './api/orchestrator_pb';
import {
  ClientActorClient,
  TrialLifecycleClient,
} from './api/orchestrator_pb_service';
import {TrialController} from './TrialController';
import {CogSettings, TrialActor} from './types';

const logger = getLogger('CogmentService');

/**
 * A function that implements the participation of this actor class in a trial.
 * @param session - An {@link ActorSession | `ActorSession`} instance the actor controls to interact with a trial.
 * @typeParam ActionT - The action space type for this actor class
 * @typeParam ObservationT - The observation space type for this actor class
 * @typeParam RewardT - The reward type for this actor class
 */
export type ActorImplementation<
  ActionT extends Message,
  ObservationT extends Message,
  RewardT extends Message
> = (session: ActorSession<ActionT, ObservationT, RewardT>) => Promise<void>;

/**
 * Instantiate a new CogmentService that is bound to {@link CogSettings | `CogSettings`} and gRPC clients. This class
 * tracks registered actors and is used for creating {@link TrialController | `TrialController's`}
 */
export class CogmentService {
  private actors: Record<
    string,
    [TrialActor, ActorImplementation<Message, Message, Message>]
  > = {};

  /**
   *
   * @param cogSettings - generated CogSettings file
   * @param trialLifecycleClient - a gRPC client for the TrialLifecycle service
   * @param clientActorClient - a gRPC client for the ClientActor service
   * @param actionStreamClient - a gRPC streaming client for the ClientActor.ActionStream endpoint
   * @param watchTrialsClient -  a gRPC streaming client for the TrialLifecycle.WatchTrials endpoint
   * @internal
   */
  // eslint-disable-next-line max-params
  constructor(
    private readonly cogSettings: CogSettings,
    private trialLifecycleClient: TrialLifecycleClient,
    private clientActorClient: ClientActorClient,
    private actionStreamClient: grpc.Client<
      TrialActionRequest,
      TrialActionReply
    >,
    private watchTrialsClient: grpc.Client<TrialListRequest, TrialListEntry>,
  ) {}

  /**
   * Return a TrialController configured with registered TrialActor's, CogSettings and gRPC clients.
   */
  public createTrialController(): TrialController {
    return new TrialController(
      this.cogSettings,
      Object.values(this.actors),
      this.trialLifecycleClient,
      this.clientActorClient,
      this.actionStreamClient,
      this.watchTrialsClient,
    );
  }

  /**
   * Register a new actor that will participate in the trial. The actor must be defined in cogment.yaml
   * @param actorConfig - Configuration matching a {@link CogmentYamlActor.name | `CogmentYamlActor.name`}
   * @param actorImpl - The function implementation for this actor
   * @typeParam ActionT - the action space type for this actor class
   * @typeParam ObservationT - the observation space type for this actor class
   * @typeParam RewardT - the reward type for this actor class
   */
  public registerActor<
    ActionT extends Message,
    ObservationT extends Message,
    RewardT extends Message
  >(
    actorConfig: TrialActor,
    actorImpl: ActorImplementation<ActionT, ObservationT, RewardT>,
  ): void {
    logger.info(
      `Registering actor ${actorConfig.name} with class ${actorConfig.actorClass}`,
    );
    if (this.actors[actorConfig.name]) {
      logger.warn(
        `Actor with name ${actorConfig.name} already registered, overwriting.`,
      );
    }

    if (Object.keys(this.actors).length > 1) {
      logger.warn('Support for more than a single actor is not supported.');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.actors[actorConfig.name] = [actorConfig, actorImpl];
  }
}
