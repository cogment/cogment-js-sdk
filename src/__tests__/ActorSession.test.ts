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
import {
  AsyncMessage,
  EmmaAction,
  Observation,
  Reward,
} from '../../__tests__/end-to-end/cogment-app/clients/web/src/data_pb';
import {ActorSession} from '../ActorSession';
import {createService} from '../Cogment';
import {
  TerminateTrialRequest,
  TrialJoinRequest,
  TrialStartRequest,
} from '../cogment/api/orchestrator_pb';
import {getLogger} from '../lib/Logger';

const logger = getLogger('ActorSession');

describe('ActorSession', () => {
  describe('#eventLoop', () => {
    test('can send and receive observations', () => {
      const service = createService(
        cogSettings,
        NodeHttpTransport(),
        grpc.WebsocketTransport(),
      );

      // TODO: this fails if run before registerActor
      // const trialController = service.createTrialController(trialLifecycleClient);

      let trialId: string;

      service.registerActor<EmmaAction, Observation, Reward, AsyncMessage>(
        {name: 'emma', class: 'emma'},
        async (actorSession) => {
          logger.info('Actor running');
          actorSession.start();
          logger.info('Actor session started');

          setTimeout(actorSession.stop.bind(actorSession), 3000);

          const trialJoinRequest = new TrialJoinRequest();
          trialJoinRequest.setTrialId(trialId);
          trialJoinRequest.setActorClass('emma');

          await actorSession.joinTrial(trialJoinRequest);
          await actorSession.sendAction(new EmmaAction());

          for await (const {observation} of actorSession.eventLoop()) {
            if (observation) {
              logger.info(
                `Received an observation for tick id ${observation.getTime()}: ${JSON.stringify(
                  observation.toObject(),
                  undefined,
                  2,
                )}`,
              );
              expect(observation.getTime()).not.toBe(0);
              expect(observation.getTime()).not.toEqual('');
              expect(
                Math.abs(Date.now() / 1000 - observation.getTime()),
              ).toBeLessThan(5000);
              expect(observation.getTime() * 1000).toBeLessThanOrEqual(
                Date.now() + 60000,
              );
              const action = new EmmaAction();
              await actorSession.sendAction(action);
            }
          }
        },
      );
      const trialController = service.createTrialController();
      const request = new TrialStartRequest();
      request.setUserId('emma');
      return trialController
        .startTrial(request)
        .then((response) => {
          trialId = response.getTrialId();
          return new Promise<typeof response>((resolve) =>
            setTimeout(() => resolve(response), 5000),
          );
        })
        .then((response) => {
          return trialController.terminateTrial(
            new TerminateTrialRequest(),
            response.getTrialId(),
          );
        });
    }, 10000);
  });
});
