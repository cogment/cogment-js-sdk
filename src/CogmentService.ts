/*
 *  Copyright 2020 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
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
import values from 'lodash/values';
import {CogSettings, TrialActor} from './@types/cogment';
import {ActorSession} from './ActorSession';
import {TrialLifecycleClient} from './cogment/api/orchestrator_pb_service';
import {logger} from './lib/Logger';
import {TrialController} from './TrialController';

export type ActorImplementation<
  ActionT extends Message,
  ObservationT extends Message,
  RewardT extends Message,
  MessageT extends Message
> = (
  session: ActorSession<ActionT, ObservationT, RewardT, MessageT>,
) => Promise<void>;

export class CogmentService {
  private actors: Record<
    string,
    [TrialActor, ActorImplementation<any, any, any, any>]
  > = {};

  constructor(private readonly cogSettings: CogSettings) {}

  public registerActor<
    ActionT extends Message,
    ObservationT extends Message,
    RewardT extends Message,
    MessageT extends Message
  >(
    actorConfig: TrialActor,
    actorImpl: ActorImplementation<ActionT, ObservationT, RewardT, MessageT>,
  ): void {
    if (this.actors[actorConfig.name]) {
      logger.warn(
        `Actor with name ${actorConfig.name} already registered, overwriting.`,
      );
    }
    this.actors[actorConfig.name] = [actorConfig, actorImpl];
  }

  public createTrialLifecycleClient = (
    backendUrl = this.cogSettings.connection.http,
    transport = grpc.CrossBrowserHttpTransport({withCredentials: false}),
  ): TrialLifecycleClient => new TrialLifecycleClient(backendUrl, {transport});

  public createTrialController = (
    trialLifecycleClient: TrialLifecycleClient = this.createTrialLifecycleClient(),
  ): TrialController =>
    new TrialController(trialLifecycleClient, [...values(this.actors)]);
}
