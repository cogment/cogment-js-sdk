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
import {VersionInfo, VersionRequest} from '../../src/cogment/api/common_pb';
import {ActorSession} from '../../src/cogment/Actor';
import {TrialActor} from '../../src/cogment/types';
import {config} from '../../src/lib/Config';
import {getLogger} from '../../src/lib/Logger';
import {cogSettings} from './cogment-app/webapp/src/CogSettings';
import {cogment_app as PB} from './cogment-app/webapp/src/data_pb';

const logger = getLogger('cogment').childLogger('__tests__/end-to-end');

describe('a cogment-app', () => {
  test('runs', async () => {
    const pingActor = async (
      actorSession: ActorSession<PB.ClientAction, PB.Observation>,
    ) => {
      logger.info('Actor running');
      actorSession.start();
      logger.info('Actor session started');

      let keepGoing = true;
      setTimeout(() => (keepGoing = false), 3000);

      const action = new PB.ClientAction();
      action.request = 'ping';
      actorSession.doAction(action);

      for await (const {
        observation,
        messages,
        rewards,
        tickId,
      } of actorSession.eventLoop()) {
        if (observation) {
          logger.info(
            `Received an observation: ${JSON.stringify(
              observation.toObject(),
              undefined,
              2,
            )}`,
          );
          const action = new ClientAction();
          action.setRequest('ping');
          actorSession.sendAction(action);
        }
        if (message) {
          logger.info(message);
        }

        if (reward) {
          logger.info(reward);
        }

        if (tickId ?? 0 > 10) {
          actorSession.stop();
        }
      }
    };

    const trialActor: TrialActor = {name: 'client_actor', actorClass: 'client'};
    const service = createService({
      cogSettings: cogSettings,
      grpcURL: config.connection.http,
      unaryTransportFactory: NodeHttpTransport(),
      streamingTransportFactory: grpc.WebsocketTransport(),
    });

    // TODO: this fails if run before registerActor
    // const trialController = service.createTrialController(trialLifecycleClient);

    service.registerActor<ClientAction, Observation, never>(
      trialActor,
      pingActor,
    );

    const trialController = service.createTrialController();
    const {trialId} = await trialController.startTrial(trialActor.name);
    await trialController.joinTrial(trialId, trialActor);
    // eslint-disable-next-line compat/compat
    await new Promise((resolve) => setTimeout(resolve, 500));
    return trialController.terminateTrial(trialId);
  });

  test('passes back actor config', async () => {
    const trialActor: TrialActor = {name: 'client_actor', actorClass: 'client'};
    const service = createService({
      cogSettings: cogSettings,
      grpcURL: config.connection.http,
      unaryTransportFactory: NodeHttpTransport(),
      streamingTransportFactory: grpc.WebsocketTransport(),
    });

    // TODO: this fails if run before registerActor
    // const trialController = service.createTrialController(trialLifecycleClient);

    service.registerActor<ClientAction, Observation, never>(
      trialActor,
      async (actorSession) => {
        logger.info('Actor running');
        actorSession.start();
        logger.info('Actor session started');

        setTimeout(actorSession.stop.bind(actorSession), 3000);

        const action = new ClientAction();
        action.setRequest('ping');
        actorSession.sendAction(action);

        for await (const {
          observation,
          message,
          reward,
          tickId,
        } of actorSession.eventLoop()) {
          if (observation) {
            logger.info(
              `Received an observation: ${JSON.stringify(
                observation.toObject(),
                undefined,
                2,
              )}`,
            );
            const action = new ClientAction();
            action.setRequest('ping');
            actorSession.sendAction(action);
          }
          if (message) {
            logger.info(message);
          }

          if (reward) {
            logger.info(reward);
          }

          if (tickId ?? 0 > 10) {
            actorSession.stop();
          }
        }
      },
    );

    const trialController = service.createTrialController();
    const {trialId} = await trialController.startTrial(trialActor.name);
    const joinResponse = await trialController.joinTrial(trialId, trialActor);
    expect(joinResponse.config.configMessage).toEqual('test');

    await new Promise((resolve) => setTimeout(resolve, 500));
    return trialController.terminateTrial(trialId);
  });
});
