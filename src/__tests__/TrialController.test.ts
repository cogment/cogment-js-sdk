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

import {NodeHttpTransport} from '@improbable-eng/grpc-web-node-http-transport';
import cogSettings from '../__data__/cog_settings';
import {createService} from '../Cogment';
import {VersionInfo, VersionRequest} from '../cogment/api/common_pb';
import {TrialController} from '../TrialController';

describe('TrialController', () => {
  test('can request a `VersionInfo` from cogment', () => {
    const service = createService(cogSettings);
    // const transport = grpc.CrossBrowserHttpTransport({withCredentials: false});
    const transport = NodeHttpTransport();
    const trialLifecycleClient = service.createTrialLifecycleClient(
      cogSettings.connection.backendUrl,
      transport,
    );

    const trialController = service.createTrialController(trialLifecycleClient);

    const request = new VersionRequest();

    return trialController.version(request).then((response) => {
      expect(response).toBeInstanceOf(VersionInfo);
      expect(response.getVersionsList().length).toBeGreaterThan(0);
    });
  });
});
