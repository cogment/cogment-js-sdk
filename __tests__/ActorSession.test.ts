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
import {ActorSession, createService, getLogger} from '../src';
import {TrialActor} from '../src/@types/cogment';
import {config} from '../src/lib/Config';
import cogSettings from './end-to-end/cogment-app/webapp/src/cog_settings';
import {
  ClientAction,
  ClientMessage,
  Observation,
  TrialConfig,
} from './end-to-end/cogment-app/webapp/src/data_pb';

const logger = getLogger('ActorSession');

describe('ActorSession', () => {
  const TEST_MESSAGE = 'foo';

  describe('#eventLoop', () => {
    beforeAll(async () => {
      const service = createService({
        cogSettings: cogSettings,
        grpcURL: config.connection.http,
        unaryTransportFactory: NodeHttpTransport(),
        streamingTransportFactory: grpc.WebsocketTransport(),
      });

      // TODO: this fails if run before registerActor
      // const trialController = service.createTrialController(trialLifecycleClient);

      const trialActor: TrialActor = {
        name: 'client_actor',
        actorClass: 'client',
      };

      service.registerActor<ClientAction, Observation, never, ClientMessage>(
        trialActor,
        async (actorSession) => {
          logger.info('Actor running');
          actorSession.start();
          logger.info('Actor session started');

          setTimeout(actorSession.stop.bind(actorSession), 3000);

          const action = new ClientAction();
          action.setRequest(TEST_MESSAGE);
          await actorSession.sendAction(action);

          for await (const {observation} of actorSession.eventLoop()) {
            if (observation) {
              logger.info(
                `Received an observation for tick id ${observation.getTimestamp()}: ${JSON.stringify(
                  observation.toObject(),
                  undefined,
                  2,
                )}`,
              );

              const action = new ClientAction();
              action.setRequest(TEST_MESSAGE);
              actorSession.sendAction(action);
              const timestamp = observation.getTimestamp();
              const tickId = actorSession.getTickId();
              const response = observation.getResponse();
              if (timestamp) {
                timestampPromise = Promise.resolve(timestamp);
              }
              if (tickId) {
                tickIdPromise = Promise.resolve(tickId);
              }
              if (response) {
                responsePromise = Promise.resolve(response);
              }
              observationPromise = Promise.resolve(observation);
            }
          }
        },
      );
      const trialController = service.createTrialController();
      const trialConfig = new TrialConfig();
      trialConfig.setSuffix(' bar');

      const {trialId} = await trialController.startTrial(
        trialActor.name,
        trialConfig,
      );
      await trialController.joinTrial(trialId, trialActor);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return trialController.terminateTrial(trialId);
    }, 5000);

    // TODO: Use types from CogSettings.d.ts - although almost why bother, type completion in editors is good enough
    let observationPromise: Promise<Observation>;
    let timestampPromise: Promise<number>;
    let responsePromise: Promise<string>;
    let tickIdPromise: Promise<number>;
    test('receives observations', async () => {
      await expect(observationPromise).resolves.toBeInstanceOf(Observation);
    });
    test('we are receiving a timestamp from the environment', async () => {
      await expect(timestampPromise).resolves.not.toBe(0);
      await expect(timestampPromise).resolves.not.toEqual('');
      await expect(timestampPromise).resolves.toBeLessThanOrEqual(Date.now());
    });
    test('receives an incrementing tickId from the cogment framework', async () => {
      await expect(tickIdPromise).resolves.toBeGreaterThan(0);
    }, 5000);
    test('receives an echo response from the echo server', async () => {
      await expect(responsePromise).resolves.toEqual(TEST_MESSAGE);
    }, 5000);
  });
  // TODO: Write a test that detects the suffix set on trialConfig when starting a trial
});
