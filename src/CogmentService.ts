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

import {CogSettings} from './@types/cogment';
import {ActorSession} from './ActorSession';
import {logger} from './lib/Logger';
import {TrialActor} from './TrialActor';
import {TrialController} from './TrialController';

export type ActorImplementation = (session: ActorSession) => Promise<void>;

export class CogmentService {
  private actors: Record<string, [TrialActor, ActorImplementation]> = {};
  constructor(private cogSettings: CogSettings) {}
  public registerActor(
    actorConfig: TrialActor,
    actorImpl: ActorImplementation,
  ): void {
    if (this.actors[actorConfig.name]) {
      logger.warn(
        `Actor with name ${actorConfig.name} already registered, overwriting.`,
      );
    }
    this.actors[actorConfig.name] = [actorConfig, actorImpl];
  }
  public createTrialController(): TrialController {
    return new TrialController(this.cogSettings);
  }
}
