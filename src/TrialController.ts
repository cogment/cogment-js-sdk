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
import {
  TrialConfig,
  VersionInfo,
  VersionRequest,
} from './cogment/api/common_pb';
import {ServiceError} from './cogment/api/environment_pb_service';
import {
  TerminateTrialRequest,
  TrialActionReply,
  TrialActionRequest,
  TrialInfoReply,
  TrialInfoRequest,
  TrialJoinReply,
  TrialJoinRequest,
  TrialMessageReply,
  TrialStartReply,
  TrialStartRequest,
  TrialState,
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
  // eslint-disable-next-line max-params
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

  /**
   * The trialId of any started or joined trial.
   * @returns The trial id
   */
  public getTriaId(): string {
    if (!this.trialId) {
      throw new Error('No trial currently running');
    }
    return this.trialId;
  }

  public async getTrialInfo(trialId: string): Promise<TrialInfoReply> {
    // eslint-disable-next-line compat/compat
    return await new Promise((resolve, reject) => {
      this.trialLifecycleClient.getTrialInfo(
        new TrialInfoRequest(),
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

  // TODO: this causes an orchestrator crash, guessing header related in getTrialInfo call
  public async isTrialOverBroken(trialId: string): Promise<boolean> {
    return this.getTrialInfo(trialId).then((trialInfoReply) => {
      return !!trialInfoReply.getTrialList()?.find((trialInfo) => {
        return (
          trialInfo.getTrialId() === trialId &&
          trialInfo.getState() === TrialState.RUNNING
        );
      });
    });
  }

  public async isTrialOver(trialId: string): Promise<boolean> {
    // eslint-disable-next-line compat/compat
    return Promise.resolve(!this.trialId);
  }

  public async joinTrial(
    trialId: string,
    trialActor?: TrialActor,
  ): Promise<JoinTrialReturnType> {
    const request = new TrialJoinRequest();
    request.setTrialId(trialId);
    if (trialActor) {
      request.setActorName(trialActor.name);
      request.setActorClass(trialActor.actorClass);
    }
    // eslint-disable-next-line compat/compat
    const response = await new Promise<JoinTrialReturnType>(
      (resolve, reject) => {
        this.actorEndpointClient.joinTrial(
          request,
          (error: ServiceError | null, response: TrialJoinReply | null) => {
            if (error || !response) {
              return reject(error);
            }
            this.trialId = response.getTrialId();
            resolve(response.toObject());
          },
        );
      },
    );

    await this.startActors(response.trialId);
    return response;
  }

  /**
   * Start a new trial.
   * @param actorClass - The name of an actor_class corresponding to `cogment.yaml`
   * @param trialConfig - A TrialConfig protobuf that will merge with `trial_params.trial_config` from `cogment.yaml`
   * @returns A trial start response
   */
  public async startTrial(
    // TODO: what does the backend do with TrialStartRequest#user_id? This should be optional if we are to be able to
    //  start trials without joining them.
    actorClass: string,
    trialConfig?: Message,
  ): Promise<StartTrialReturnType> {
    // eslint-disable-next-line compat/compat
    return new Promise<StartTrialReturnType>((resolve, reject) => {
      const request = new TrialStartRequest();
      request.setUserId(actorClass);
      if (trialConfig && this.cogSettings.trial.config_type) {
        const trialConfigInternal = new TrialConfig();
        trialConfigInternal.setContent(trialConfig.serializeBinary());
        request.setConfig(trialConfigInternal);
      } else if (trialConfig) {
        // TODO: should we throw here?
        logger.warn(
          'trialConfig passed without a configured TrialConfig protobuf. Please update cogment.yaml and run cogment generate',
        );
      }
      this.trialLifecycleClient.startTrial(request, (error, response) => {
        if (error || response === null) {
          return reject(error);
        }
        this.trialId = response.getTrialId();
        resolve(response.toObject());
      });
    });
  }

  public async terminateTrial(trialId: string): Promise<void> {
    // eslint-disable-next-line compat/compat
    return await new Promise((resolve, reject) => {
      this.trialLifecycleClient.terminateTrial(
        new TerminateTrialRequest(),
        new grpc.Metadata({'trial-id': trialId}),
        (error, response) => {
          if (error || response === null) {
            return reject(error);
          }
          this.trialId = undefined;
          resolve();
        },
      );
    });
  }

  public async version(): Promise<VersionReturnType> {
    // eslint-disable-next-line compat/compat
    return await new Promise((resolve, reject) => {
      this.trialLifecycleClient.version(
        new VersionRequest(),
        (error, response) => {
          if (error || response === null) {
            return reject(error);
          }
          resolve({version: response.toObject().versionsList});
        },
      );
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

export type SendMessageReturnType = TrialMessageReply.AsObject;
export type StartTrialReturnType = TrialStartReply.AsObject;

export type JoinTrialArguments = {
  actorClass?: string;
  actorName?: string;
  trialId: string;
};

export type JoinTrialReturnType = TrialJoinReply.AsObject;

export type VersionReturnType = {version: VersionInfo.AsObject['versionsList']};
