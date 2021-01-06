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
import map from 'lodash/map';
import {CogSettings, TrialActor} from './@types/cogment';
import {ActorSession} from './ActorSession';
import {VersionInfo, VersionRequest} from './cogment/api/common_pb';
import {
  TerminateTrialReply,
  TerminateTrialRequest,
  TrialActionReply,
  TrialActionRequest,
  TrialInfoReply,
  TrialInfoRequest,
  TrialStartReply,
  TrialStartRequest,
} from './cogment/api/orchestrator_pb';
import {
  ActorEndpointClient,
  TrialLifecycleClient,
} from './cogment/api/orchestrator_pb_service';
import {ActorImplementation} from './CogmentService';
import {getLogger} from './lib/Logger';

const logger = getLogger('TrialController');

export class TrialController {
  private trialId?: string;

  /**
   *
   * @param cogSettings - {@link CogSettings | `cog_settings.js`} generated file
   * @param actors - An array of [{@link TrialActor}, {@link ActorImplementation}] tuples
   * @param trialLifecycleClient - A {@link TrialLifecycleClient | `TrialLifecycleClient`}
   * @param actorEndpointClient - An {@link ActorEndpointClient | `ActorEndpointClient`}
   * @param actionStreamClient - A grpc-web client for the {@link ActorEndpoint#ActionStream} endpoint
   */
  constructor(
    private cogSettings: CogSettings,
    private actors: [
      TrialActor,
      ActorImplementation<never, never, never, never>,
    ][],
    private trialLifecycleClient: TrialLifecycleClient,
    private actorEndpointClient: ActorEndpointClient,
    private actionStreamClient: grpc.Client<
      TrialActionRequest,
      TrialActionReply
    >,
  ) {}
  public async getTrialInfo(
    request: TrialInfoRequest,
    trialId: string,
  ): Promise<TrialInfoReply> {
    // eslint-disable-next-line compat/compat
    return await new Promise((resolve, reject) => {
      this.trialLifecycleClient.getTrialInfo(
        request,
        new grpc.Metadata({'trial-id': trialId}),
        (error, response) => {
          if (error || response === null) {
            return reject(error);
          }
          resolve(response);
        },
      );
    });
  }

  public async startTrial(
    request: TrialStartRequest,
  ): Promise<TrialStartReply> {
    // eslint-disable-next-line compat/compat
    return new Promise<TrialStartReply>((resolve, reject) => {
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.trialLifecycleClient.startTrial(request, (error, response) => {
        if (error || response === null) {
          return reject(error);
        }
        resolve(response);
      });
    }).then((response) => {
      logger.info(`Starting actors for trial ${response.getTrialId()}`);
      // TODO: We currently only support a single actor client, investigate using `TrialLifecycleClient#actionStream`
      this.trialId = response.getTrialId();

      // eslint-disable-next-line compat/compat
      return Promise.all(
        map(this.actors, ([actor, actorImpl]) => {
          logger.info(`Starting actor ${actor.name}`);
          this.actionStreamClient.start({
            'trial-id': response.getTrialId(),
            'actor-name': actor.name,
          });

          const actorSession = new ActorSession(
            actor,
            this.cogSettings,
            this.actorEndpointClient,
            this.actionStreamClient,
          );
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return actorImpl(actorSession);
        }),
      ).then(() => response);
    });
  }

  public async terminateTrial(
    request: TerminateTrialRequest,
    trialId: string = this.cogSettings.connection.http,
  ): Promise<TerminateTrialReply> {
    // eslint-disable-next-line compat/compat
    return await new Promise((resolve, reject) => {
      this.trialLifecycleClient.terminateTrial(
        request,
        new grpc.Metadata({'trial-id': trialId}),
        // eslint-disable-next-line sonarjs/no-identical-functions
        (error, response) => {
          if (error || response === null) {
            return reject(error);
          }
          resolve(response);
        },
      );
    });
  }

  public async version(
    request: VersionRequest = new VersionRequest(),
  ): Promise<VersionInfo> {
    // eslint-disable-next-line compat/compat
    return await new Promise((resolve, reject) => {
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.trialLifecycleClient.version(request, (error, response) => {
        if (error || response === null) {
          return reject(error);
        }
        resolve(response);
      });
    });
  }
}
