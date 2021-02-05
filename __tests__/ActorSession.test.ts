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
  EnvConfig as EnvironmentConfig,
  Observation,
  TrialConfig,
} from './end-to-end/cogment-app/webapp/src/data_pb';

const logger = getLogger('ActorSession');

describe('ActorSession', () => {
  const TEST_MESSAGE = 'foo';

  // eslint-disable-next-line sonarjs/cognitive-complexity
  describe('#eventLoop', () => {
    // TODO: Use types from CogSettings.d.ts - although almost why bother, type completion in editors is good enough
    let lastObservation: Observation;
    let lastTimestamp: number;
    let lastResponse: string;
    let lastTickId: number;

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
          actorSession.sendAction(action);

          for await (const {observation} of actorSession.eventLoop()) {
            if (observation) {
              const action = new ClientAction();
              action.setRequest(TEST_MESSAGE);
              actorSession.sendAction(action);
              const timestamp = observation.getTimestamp();
              const tickId = actorSession.getTickId();
              const response = observation.getResponse();
              logger.info(
                `Received an observation for tick id ${
                  tickId ?? ''
                }: ${JSON.stringify(observation.toObject(), undefined, 2)}`,
              );
              if (timestamp) {
                lastTimestamp = timestamp;
              }
              if (tickId) {
                lastTickId = tickId;
              }
              if (response) {
                lastResponse = response;
              }
              lastObservation = observation;
            }
          }
        },
      );
      const trialController = service.createTrialController();

      const trialConfig = new TrialConfig();
      const environmentConfig = new EnvironmentConfig();
      environmentConfig.setSuffix(' bar');
      trialConfig.setEnvConfig(environmentConfig);

      const {trialId} = await trialController.startTrial(
        trialActor.name,
        trialConfig,
      );
      await trialController.joinTrial(trialId, trialActor);
      // eslint-disable-next-line compat/compat
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return trialController.terminateTrial(trialId);
    });

    test('receives observations', () => {
      expect(lastObservation).toBeInstanceOf(Observation);
    });

    test('we are receiving a timestamp from the environment', () => {
      expect(lastTimestamp).not.toBe(0);
      expect(lastTimestamp).not.toEqual('');
      expect(lastTimestamp).toBeLessThanOrEqual(Date.now());
    });

    test('receives an incrementing tickId from the cogment framework', () => {
      expect(lastTickId).toBeGreaterThan(0);
    });

    test('receives an echo response from the echo server', () => {
      expect(lastResponse).toEqual(TEST_MESSAGE);
    });
  });
  // TODO: Write a test that detects the suffix set on trialConfig when starting a trial
});
