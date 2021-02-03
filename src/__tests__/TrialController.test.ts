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
import cogSettings from '../../__tests__/end-to-end/cogment-app/webapp/src/cog_settings';
import {TrialActor} from '../@types/cogment';
import {createService} from '../Cogment';
import {config} from '../lib/Config';
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
    ])('with a %s', async (description, transport) => {
      const service = createService({
        cogSettings: cogSettings,
        grpcURL: config.connection.http,
        unaryTransportFactory: transport,
      });
      const trialController = service.createTrialController();
      const response = await trialController.version();
      expect(response.version.length).toBeGreaterThan(0);
    });
  });

  test('can execute a trial', async () => {
    const trialActor: TrialActor = {name: 'client_actor', actorClass: 'client'};
    const clientName = trialActor.name;
    const transport = NodeHttpTransport();
    const service = createService({
      cogSettings: cogSettings,
      grpcURL: config.connection.http,
      unaryTransportFactory: transport,
    });

    const trialController = service.createTrialController();

    const response = await trialController.startTrial(clientName);
    const trialId = response.trialId;

    expect(trialId).toBeTruthy();
    expect(response.actorsInTrialList).toEqual(
      expect.arrayContaining([trialActor]),
    );
    const trialInfo = await trialController.getTrialInfo(trialId);
    expect(trialInfo.toObject().trialList).toContainEqual(
      expect.objectContaining({
        trialId,
        // TODO: export our own type probably
        // state: TrialState.PENDING,
      }),
    );
    const terminatePromise = trialController.terminateTrial(trialId);
    // noinspection BadExpressionStatementJS
    expect(terminatePromise).resolves;
  }, 10000);
});
