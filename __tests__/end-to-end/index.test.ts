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
import {Context, TransportType} from '../../src/cogment/Context';
import {config} from '../../src/lib/Config';
import {getLogger} from '../../src/lib/Logger';
import {cogSettings} from './cogment-app/webapp/src/CogSettings';
import {cogment_app as PB} from './cogment-app/webapp/src/data_pb';

const logger = getLogger('cogment').childLogger('__tests__/end-to-end');

describe('a cogment-app', () => {
  const observations: PB.Observation[] = [];

  test('runs', async () => {
    let resolve = () => {};
    const promise = new Promise<void>((_resolve) => {
      resolve = _resolve;
    });

    const pingActor = async (
      actorSession: ActorSession<PB.ClientAction, PB.Observation>,
    ) => {
      console.log('Actor running');
      actorSession.start();
      console.log('Actor session started');

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
          console.log(
            `Received an observation: ${JSON.stringify(
              observation,
              undefined,
              2,
            )}`,
          );
          observations;
          const action = new PB.ClientAction();
          action.request = 'ping';
          if (!keepGoing) {
            resolve();
            return;
          }
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

    const context = new Context<PB.ClientAction, PB.Observation>(
      cogSettings,
      'test_client',
    );
    context.registerActor(pingActor, 'client_actor', 'client');

    const controller = context.getController(config.connection.http);
    const trialId = await controller.startTrial();
    await context.joinTrial(trialId, config.connection.http, 'client_actor');
    await promise;
    return;
  });

  // test('Receives Observations', async () => {
  //   expect(observations).not.toHaveLength(0);
  // });
});
