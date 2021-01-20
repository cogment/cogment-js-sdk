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
import {NodeHttpTransport} from '@improbable-eng/grpc-web-node-http-transport';
import cogSettings from '../../__tests__/end-to-end/cogment-app/clients/web/src/cog_settings';
import {TrialState} from '../cogment/api/orchestrator_pb';
import {config} from '../lib/Config';
import {createService} from '../Cogment';
import {TrialController} from '../TrialController';

describe('TrialController', () => {
  describe('when given an invalid orchestrator url', () => {
    test('fails to make a request to orchestrator', () => {
      const transport = NodeHttpTransport();
      const service = createService({
        cogSettings,
        grpcURL: 'http://example.com',
        unaryTransportFactory: transport,
      });

      const trialController = service.createTrialController();
      return expect(trialController.version()).rejects.toBeInstanceOf(Error);
    });
  });

  describe('can request `VersionInfo` from orchestrator', () => {
    test.each([
      ['NodeHttpTransport', NodeHttpTransport()],
      ['WebsocketTransport', grpc.WebsocketTransport()],
    ])('with a %s', (description, transport) => {
      const service = createService({
        cogSettings: cogSettings,
        grpcURL: config.connection.http,
        unaryTransportFactory: transport,
      });
      const trialController = service.createTrialController();
      return trialController.version().then((response) => {
        expect(response.version.length).toBeGreaterThan(0);
      });
    });
  });

  test('can execute a trial', () => {
    const trialActor = {name: 'emma', class: 'emma'};
    const clientName = trialActor.name;
    const transport = NodeHttpTransport();
    const service = createService({
      cogSettings: cogSettings,
      grpcURL: config.connection.http,
      unaryTransportFactory: transport,
    });

    const trialController = service.createTrialController();

    return trialController.startTrial(clientName).then((response) => {
      const trialId = response.trialId;

      expect(trialId).toBeTruthy();
      expect(response.actorsInTrialList).toEqual(
        expect.arrayContaining([{actorClass: 'emma', name: 'emma'}]),
      );
      const trialLifecyclePromise = trialController
        .getTrialInfo(trialId)
        .then((trialInfo) => {
          expect(trialInfo.toObject().trialList).toContainEqual(
            expect.objectContaining({
              trialId,
              // TODO: export our own type probably
              // state: TrialState.PENDING,
            }),
          );
          return trialController.terminateTrial(trialId);
        });
      expect(trialLifecyclePromise).resolves;
    });
  });
});
