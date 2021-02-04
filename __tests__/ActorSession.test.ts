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
} from './end-to-end/cogment-app/webapp/src/data_pb';

const logger = getLogger('ActorSession');

describe('ActorSession', () => {
  describe('#eventLoop', () => {
    test('can send and receive observations', async () => {
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
          action.setRequest('ping');
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
              expect(observation.getTimestamp()).not.toBe(0);
              expect(observation.getTimestamp()).not.toEqual('');
              expect(Date.now() - observation.getTimestamp()).toBeGreaterThan(
                0,
              );
              expect(observation.getTimestamp()).toBeLessThanOrEqual(
                Date.now(),
              );
              const action = new ClientAction();
              action.setRequest('pong');
              await actorSession.sendAction(action);
            }
          }
        },
      );
      const trialController = service.createTrialController();

      const {trialId} = await trialController.startTrial(trialActor.name);
      await trialController.joinTrial(trialId, trialActor);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return trialController.terminateTrial(trialId);
    }, 10000);
  });
});
