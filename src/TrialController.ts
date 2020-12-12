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

import * as jspb from 'google-protobuf';
import {
  TrialConfig,
  VersionInfo,
  VersionRequest,
} from './cogment/api/common_pb';
import {
  TerminateTrialReply,
  TerminateTrialRequest,
  TrialStartReply,
  TrialStartRequest,
} from './cogment/api/orchestrator_pb';
import {TrialLifecycleClient} from './cogment/api/orchestrator_pb_service';

export type ActorConfig = {name: string; classes: string[]};

export interface JoinTrialArguments {
  actorId: 0;
  actorImplName: 'human';
  trialId: string;
}

export interface StartTrialArguments {
  config: TrialConfig;
}
export interface StartTrialReturnType {
  actors: ActorConfig[];
  trialId: string;
}

export class TrialController {
  constructor(private trialLifecycleClient: TrialLifecycleClient) {}
  public async startTrial(
    request: TrialStartRequest,
  ): Promise<TrialStartReply> {
    // eslint-disable-next-line compat/compat
    return await new Promise((resolve, reject) => {
      this.trialLifecycleClient.startTrial(request, (error, response) => {
        if (error || response === null) {
          return reject(error);
        }
        resolve(response);
      });
    });
  }

  public async terminateTrial(
    request: TerminateTrialRequest,
  ): Promise<TerminateTrialReply> {
    // eslint-disable-next-line compat/compat
    return await new Promise((resolve, reject) => {
      // eslint-disable-next-line sonarjs/no-identical-functions
      this.trialLifecycleClient.terminateTrial(request, (error, response) => {
        if (error || response === null) {
          return reject(error);
        }
        resolve(response);
      });
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
