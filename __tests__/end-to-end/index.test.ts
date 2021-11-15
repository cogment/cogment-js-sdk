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
import {ActorSession} from '../../src/cogment/Actor';
import {Context} from '../../src/cogment/Context';
import {Session} from '../../src/cogment/Session';
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
      } of actorSession.eventLoop()) {
        if (observation) {
          logger.info(
            `Received an observation: ${JSON.stringify(
              observation,
              undefined,
              2,
            )}`,
          );
          const action = new PB.ClientAction();
          action.request = 'ping';
          actorSession.doAction(action);
        }
        if (messages) {
          logger.info(messages.join(','));
        }

        if (rewards) {
          logger.info(rewards.join(','));
        }
      }
    };

    const context = new Context<PB.ClientAction, PB.Observation>(cogSettings);
    context.registerActor(pingActor, 'client_actor', 'client');

    console.log(config.connection.http);

    const controller = context.getController(config.connection.http);
    console.log('controller got');
    const trialId = await controller.startTrial();
    console.log('started');
    context.joinTrial(trialId, config.connection.http, 'client_actor');
    console.log('joined');

    return controller.terminateTrial([trialId]);
  });
});
