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
import {CogSettings, TrialActor} from './@types/cogment';
import {ActorSession} from './ActorSession';
import {VersionInfo, VersionRequest} from './cogment/api/common_pb';
import {ServiceError} from './cogment/api/environment_pb_service';
import {
  MasterMessageDispatchRequest,
  MessageDispatchReply,
} from './cogment/api/message_pb';
import {
  TerminateTrialReply,
  TerminateTrialRequest,
  TrialActionReply,
  TrialActionRequest,
  TrialInfoReply,
  TrialInfoRequest,
  TrialJoinReply,
  TrialJoinRequest,
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
      ActorImplementation<Message, Message, Message, Message>,
    ][],
    private trialLifecycleClient: TrialLifecycleClient,
    private actorEndpointClient: ActorEndpointClient,
    private actionStreamClient: grpc.Client<
      TrialActionRequest,
      TrialActionReply
    >,
  ) {}

  /**
   * A list of {@link TrialActor}s associated to this trial.
   * @returns The trial actors for this trial.
   */
  public getActiveActors(): TrialActor[] {
    return this.actors.map(([trialActor]) => trialActor);
  }

  public getTickId(): number {
    throw new Error('getTriaId() is not implemented');
  }

  public getTriaId(): string {
    throw new Error('getTriaId() is not implemented');
  }

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

  public isTrialOver(): boolean {
    throw new Error('isTrialOver() is not implemented');
  }

  public joinTrial(request: TrialJoinRequest): Promise<TrialJoinReply> {
    // eslint-disable-next-line compat/compat
    return new Promise<TrialJoinReply>((resolve, reject) => {
      this.actorEndpointClient.joinTrial(
        request,
        (error: ServiceError | null, response: TrialJoinReply | null) => {
          if (error || !response) {
            return reject(error);
          }
          resolve(response);
        },
      );
    }).then((response) => {
      return this.startActors(response.getTrialId()).then(() => response);
    });
  }

  public async sendMessage(
    request: MasterMessageDispatchRequest,
  ): Promise<MessageDispatchReply> {
    // eslint-disable-next-line compat/compat
    return new Promise<MessageDispatchReply>((resolve, reject) => {
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.trialLifecycleClient.sendMessage(request, (error, response) => {
        if (error || response === null) {
          return reject(error);
        }
        resolve(response);
      });
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
      this.trialId = response.getTrialId();
      return response;
    });
  }

  public async terminateTrial(
    request: TerminateTrialRequest,
    trialId: string,
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

  private async startActors(trialId: string) {
    // eslint-disable-next-line compat/compat
    return Promise.all(
      this.actors.map(([actor, actorImpl]) => {
        logger.info(`Starting actor ${actor.name}`);
        this.actionStreamClient.start({
          'trial-id': trialId,
          'actor-name': actor.name,
        });

        const actorSession = new ActorSession(
          actor,
          this.cogSettings,
          this.actorEndpointClient,
          this.actionStreamClient,
        );
        return actorImpl(actorSession);
      }),
    );
  }
}
