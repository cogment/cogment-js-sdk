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
import {TrialConfig, VersionInfo, VersionRequest} from './api/common_pb';
import {ServiceError} from './api/environment_pb_service';
import {
  TerminateTrialRequest,
  TrialActionReply,
  TrialActionRequest,
  TrialInfoReply,
  TrialInfoRequest,
  TrialJoinReply,
  TrialJoinRequest,
  TrialListEntry,
  TrialListRequest,
  TrialMessageReply,
  TrialStartReply,
  TrialStartRequest,
} from './api/orchestrator_pb';
import {
  ClientActorClient,
  TrialLifecycleClient,
} from './api/orchestrator_pb_service';
import {ActorImplementation} from './CogmentService';
import {CogSettings, TrialActor} from './types';

const logger = getLogger('TrialController');

/**
 * Controller for interacting with trials in the Cogment framework. Each instance is bound to
 * {@link CogSettings | `CogSettings`},
 * {@link TrialActor | `TrialActor's`} {@link ActorImplementation | `ActorImplementation's`} and gRPC connections to
 * the Cogment framework.
 */
export class TrialController {
  private nextTrialListEntryPromise?: Promise<boolean>;
  private nextTrialListEntryResolve?: (doContinue: boolean) => void;
  private trialId?: string;
  private trialListEntries: TrialListEntry[] = [];

  /**
   *
   * @param cogSettings - {@link CogSettings | `CogSettings`} generated file
   * @param actors - An array of [{@link TrialActor | `TrialActor`}, {@link ActorImplementation |
   *   `ActorImplementation`}] tuples
   * @param trialLifecycleClient - A {@link TrialLifecycleClient | `TrialLifecycleClient`}
   * @param clientActorClient - An {@link ClientActorClient | `ClientActorClient`}
   * @param actionStreamClient - A grpc-web client for the {@link ClientActor#ActionStream |
   *   `ClientActor#ActionStream`} endpoint
   * @param watchTrialsClient - A grpc-web client for the
   *   {@link TrialLifecycleClient#WatchTrials | `TrialLifecycleClient#WatchTrials`} endpoint
   * @internal
   */
  // eslint-disable-next-line max-params
  constructor(
    private cogSettings: CogSettings,
    private actors: [
      TrialActor,
      ActorImplementation<Message, Message, Message>,
    ][],
    private trialLifecycleClient: TrialLifecycleClient,
    private clientActorClient: ClientActorClient,
    private actionStreamClient: grpc.Client<
      TrialActionRequest,
      TrialActionReply
    >,
    private watchTrialsClient: grpc.Client<TrialListRequest, TrialListEntry>,
  ) {
    // eslint-disable-next-line compat/compat
    this.nextTrialListEntryPromise = new Promise(
      (resolve) => (this.nextTrialListEntryResolve = resolve),
    );

    this.watchTrialsClient.onMessage(this.onWatchTrialsMessage);
    this.watchTrialsClient.onHeaders(this.onWatchTrialsHeaders);
    this.watchTrialsClient.onEnd(this.onWatchTrialsEnd);
  }

  /**
   * A list of {@link TrialActor | `TrialActor's`} associated to this trial.
   * @returns - The trial actors for this trial.
   */
  public getActiveActors(): TrialActor[] {
    return this.actors.map(([trialActor]) => trialActor);
  }

  /**
   * The id of any started or joined trial.
   * @returns - The trial id
   */
  public getTriaId(): string {
    if (!this.trialId) {
      throw new Error('No trial currently running');
    }
    return this.trialId;
  }

  /**
   * Get trial information for a given trial.
   * @param trialId - Id of the trial to retrieve info for.
   */
  public async getTrialInfo(trialId: string): Promise<TrialInfoReply> {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve, reject) => {
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

  /**
   * Check if a given trial is completed.
   * @param trialId - the id of the trial to check.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async isTrialOver(trialId: string): Promise<boolean> {
    // eslint-disable-next-line compat/compat
    return Promise.resolve(!this.trialId);
  }

  /**
   * Join a trial given a trial id.
   * @param trialId - The trialId of the trial to join.
   * @param trialActor - The TrialActor configuration to join as.
   * @returns - A trial join response
   */
  public async joinTrial<ActorConfigT = any>(
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
    const joinTrialResponse = await new Promise<JoinTrialReturnType>(
      (resolve, reject) => {
        this.clientActorClient.joinTrial(
          request,
          (error: ServiceError | null, response: TrialJoinReply | null) => {
            if (error || !response) {
              return reject(error);
            }
            this.trialId = response.getTrialId();
            const config = response.getConfig();
            const responseObject = response.toObject() as JoinTrialReturnType;
            if (config && trialActor) {
              const configType =
                this.cogSettings.actorClasses[trialActor.actorClass].config;
              if (!configType) {
                throw new Error(
                  'Config type is not defined on the submitted actorClass',
                );
              }
              responseObject.config = configType
                .deserializeBinary(config.getContent_asU8())
                .toObject();
            }
            resolve(responseObject);
          },
        );
      },
    );

    await this.startActors<ActorConfigT>(
      joinTrialResponse.trialId,
      joinTrialResponse.config,
    );
    return joinTrialResponse;
  }

  /**
   * Start a new trial.
   * @param actorClass - The name of an actor_class corresponding to {@link CogmentYaml | `cogment.yaml`}
   * @param trialConfig - A TrialConfig protobuf that will be passed to any pre-hooks configured in
   *   {@link CogmentYaml.pre_hooks | `cogment.yaml`}
   * @returns - A trial start response
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
      if (trialConfig && this.cogSettings.trial.config) {
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

  /**
   * Terminate a trial.
   * @param trialId - Id of the trial to terminate.
   */
  public async terminateTrial(trialId: string): Promise<void> {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve, reject) => {
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

  /**
   * Request the version from the Cogment framework.
   */
  public async version(): Promise<VersionReturnType> {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve, reject) => {
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

  /**
   * Watch cogment for trial changes.
   * @param filter - An enum of TrialState's to watch trial changes of.
   */
  public async *watchTrials(
    filter?: (0 | 1 | 2 | 3 | 4 | 5)[],
  ): AsyncGenerator<TrialListEntry, void, void> {
    const trialListRequest = new TrialListRequest();
    if (filter) {
      trialListRequest.setFilterList(filter);
    }

    this.watchTrialsClient.start();
    this.watchTrialsClient.send(trialListRequest);

    while (true) {
      const trialListEntry = this.trialListEntries.shift();
      if (trialListEntry) {
        logger.debug(
          `new trialListEntry ${JSON.stringify(trialListEntry, undefined, 2)}`,
        );
        yield trialListEntry;
      } else {
        logger.debug('No trialListEntries available');
        const doContinue = await this.nextTrialListEntryPromise;
        if (!doContinue) {
          break;
        }
      }
    }
  }

  private onWatchTrialsEnd = (
    code: grpc.Code,
    message: string,
    trailers: grpc.Metadata,
    // eslint-disable-next-line max-params
  ) => {
    logger.debug(
      `watchTrials received end, code: ${code}, message: ${message}, trailers: ${JSON.stringify(
        trailers,
        undefined,
        2,
      )}`,
    );
    if (this.nextTrialListEntryResolve) {
      this.nextTrialListEntryResolve(false);
    }
  };

  private onWatchTrialsHeaders = (headers: grpc.Metadata) => {
    logger.debug(
      `watchTrials received headers: ${JSON.stringify(headers, undefined, 2)}`,
    );
  };

  private onWatchTrialsMessage = (trialListEntry: TrialListEntry) => {
    if (!trialListEntry) {
      return logger.warn('Received a TrialListEntry without any data');
    }
    logger.debug(
      `Received a TrialListEntry: ${JSON.stringify(
        trialListEntry.toObject(),
        undefined,
        2,
      )}`,
    );
    this.trialListEntries.push(trialListEntry);
    if (this.nextTrialListEntryResolve) {
      this.nextTrialListEntryResolve(true);
    }
    // eslint-disable-next-line compat/compat
    this.nextTrialListEntryPromise = new Promise(
      (resolve) => (this.nextTrialListEntryResolve = resolve),
    );
  };

  private async startActors<ActorConfigT = any>(
    trialId: string,
    actorConfig: ActorConfigT,
  ) {
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
          actorConfig,
          this.cogSettings,
          this.clientActorClient,
          this.actionStreamClient,
        );
        return actorImpl(actorSession);
      }),
    );
  }
}

export type SendMessageReturnType = TrialMessageReply.AsObject;
export type StartTrialReturnType = TrialStartReply.AsObject;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JoinTrialReturnType = TrialJoinReply.AsObject & {config: any};
export type VersionReturnType = {version: VersionInfo.AsObject['versionsList']};

/**
 * Arguments to joinTrial
 */
export type JoinTrialArguments = {
  /**
   * The class of the actor; this must correspond with a {@link CogmentYaml.actor_classes}.
   */
  actorClass?: string;
  /**
   * Unique identifier for this actor connecting to the trial. Used for message passing.
   */
  actorName?: string;
  /**
   * The id of the trial to join.
   */
  trialId: string;
};
