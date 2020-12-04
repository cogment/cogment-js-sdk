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

import {VersionInfo, VersionRequest} from './cogment/api/common_pb';
import {
  ServiceError,
  TrialLifecycleClient,
} from './cogment/api/orchestrator_pb_service';

export class CogmentClient {
  constructor(private trialLifecycleClient: TrialLifecycleClient) {}

  async version(): Promise<VersionInfo.AsObject> {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve, reject) => {
      this.trialLifecycleClient.version(
        new VersionRequest(),
        (error: ServiceError | null, response: VersionInfo | null) => {
          if (error || !response) {
            return reject(error);
          }
          resolve(response.toObject());
        },
      );
    });
  }
}
