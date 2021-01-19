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

import cogSettings from '../../__tests__/end-to-end/cogment-app/clients/web/src/cog_settings';
import * as Cogment from '../Cogment';
import {createService} from '../Cogment';
import {config} from '../../src/lib/Config';
import {CogmentService} from '../CogmentService';

describe('Cogment', () => {
  describe('createService', () => {
    test('returns a `CogmentService`', () => {
      const service = createService({
        cogSettings,
        grpcURL: config.connection.http,
      });
      expect(service).toBeInstanceOf(CogmentService);
    });
  });
});
