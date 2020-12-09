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

import {createService} from '../Cogment';
import {CogmentService} from '../CogmentService';
import * as Cogment from '../Cogment';
import cogSettings from '../__mocks__/cog_settings.mock';

describe('Cogment', () => {
  it('exists', () => {
    expect(Cogment).toBeTruthy();
  });

  describe('#createService', () => {
    it('returns a CogmentService', () => {
      const service = createService(cogSettings);
      expect(service).toBeInstanceOf(CogmentService);
    });
  });
});