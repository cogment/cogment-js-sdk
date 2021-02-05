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
import {createService, StartTrialReturnType, TrialController} from '../src';
import {TrialActor} from '../src/@types/cogment';
import {TrialInfoReply} from '../src/cogment/api/orchestrator_pb';
import {config} from '../src/lib/Config';
import cogSettings from './end-to-end/cogment-app/webapp/src/cog_settings';

describe('TrialController', () => {
  const TRIAL_ACTOR: TrialActor = {
    name: 'client_actor',
    actorClass: 'client',
  };

  let isTrialOverBeforeTerminateTrial: boolean;
  let isTrialOverAfterTerminateTrial: boolean;
  let startTrialPromise: Promise<StartTrialReturnType>;
  let trialInfoPromise: Promise<TrialInfoReply.AsObject>;
  let terminateTrialPromise: Promise<void>;

  beforeAll(async () => {
    const clientName = TRIAL_ACTOR.name;
    const transport = NodeHttpTransport();
    const service = createService({
      cogSettings: cogSettings,
      grpcURL: config.connection.http,
      unaryTransportFactory: transport,
      streamingTransportFactory: grpc.WebsocketTransport(),
    });

    const trialController = service.createTrialController();

    startTrialPromise = trialController.startTrial(clientName);

    const {trialId} = await startTrialPromise;

    isTrialOverBeforeTerminateTrial = await trialController.isTrialOver(
      trialId,
    );

    trialInfoPromise = trialController
      .getTrialInfo(trialId)
      .then((trialInfo) => trialInfo.toObject());

    await trialInfoPromise;

    terminateTrialPromise = trialController.terminateTrial(trialId);

    await terminateTrialPromise;

    isTrialOverBeforeTerminateTrial = await trialController.isTrialOver(
      trialId,
    );
  });

  describe('#isTrialOver()', () => {
    test('is false before a trial starts', () => {
      expect(isTrialOverBeforeTerminateTrial).toBe(false);
    });
    test('is true after a trial ends', () => {
      expect(isTrialOverAfterTerminateTrial).toBe(true);
    });
  });

  describe('#startTrial', () => {
    test('response includes a trialId', async () => {
      await expect(startTrialPromise).resolves.toHaveProperty('trialId');
    });

    test('response.actorsInTrialList contains our trialActor', async () => {
      await expect(startTrialPromise).resolves.toMatchObject({
        actorsInTrialList: expect.arrayContaining([TRIAL_ACTOR]),
      });
    });
  });

  describe('#version()', () => {
    test.each([
      ['NodeHttpTransport', NodeHttpTransport()],
      ['WebsocketTransport', grpc.WebsocketTransport()],
    ])('with a %s', async (description, transport) => {
      const service = createService({
        cogSettings: cogSettings,
        grpcURL: config.connection.http,
        unaryTransportFactory: transport,
        streamingTransportFactory: grpc.WebsocketTransport(),
      });
      const trialController = service.createTrialController();
      const response = await trialController.version();
      expect(response.version.length).toBeGreaterThan(0);
    });
  });
});
