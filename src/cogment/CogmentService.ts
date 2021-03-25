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

import {grpc} from '@improbable-eng/grpc-web';
import {Message} from 'google-protobuf';
import {CogSettings, TrialActor} from './types';
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
import {getLogger} from '../lib/Logger';
import {TrialController} from './TrialController';

const logger = getLogger('CogmentService');

export type ActorImplementation<
  ActionT extends Message,
  ObservationT extends Message,
  RewardT extends Message
> = (session: ActorSession<ActionT, ObservationT, RewardT>) => Promise<void>;

export class CogmentService {
  private actors: Record<
    string,
    [TrialActor, ActorImplementation<Message, Message, Message>]
  > = {};

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
}
