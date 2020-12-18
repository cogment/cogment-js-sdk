/*
 *  Copyright 2020 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
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
import {createService, VersionInfo, VersionRequest} from '../../src';
import {
  TerminateTrialRequest,
  TrialJoinRequest,
  TrialStartRequest,
} from '../../src/cogment/api/orchestrator_pb';
import {TrialLifecycle} from '../../src/cogment/api/orchestrator_pb_service';
import {config} from '../../src/lib/Config';
import {logger} from '../../src/lib/Logger';

import cogSettings from './cogment-app/clients/web/src/cog_settings';
import {
  AsyncMessage,
  EmmaAction,
  Observation,
  Reward,
} from './cogment-app/clients/web/src/data_pb';

describe('grpc.WebsocketTransport', () => {
  test('is able to make a unary call to `cogment.TrialLifecycle.Version`', () => {
    const websocketTransport = grpc.WebsocketTransport();
    const versionClient = grpc.client<
      VersionRequest,
      VersionInfo,
      typeof TrialLifecycle.Version
    >(TrialLifecycle.Version, {
      host: 'http://grpcwebproxy:8080',
      transport: websocketTransport,
    });

    const mockOnMessageCb = jest.fn((message: VersionInfo) => {
      expect(message).toBeInstanceOf(VersionInfo);
    });
    const mockOnHeadersCb = jest.fn((headers: grpc.Metadata) => {});

    versionClient.onMessage(mockOnMessageCb);
    versionClient.onMessage(mockOnMessageCb);
    versionClient.onHeaders(mockOnHeadersCb);
    return new Promise((resolve, reject) => {
      versionClient.onEnd((code, message, trailers) => {
        expect(code).toBe(0);
        resolve(undefined);
      });

      versionClient.start();
      versionClient.send(new VersionRequest());
      versionClient.finishSend();
    }).then(() => {
      expect(mockOnMessageCb.mock.calls.length).toBe(2);
      expect(mockOnHeadersCb.mock.calls.length).toBe(1);
    });
  });
});

describe('a cogment-app', () => {
  test('runs', async () => {
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

        const trialJoinRequest = new TrialJoinRequest();
        trialJoinRequest.setTrialId(trialId);
        trialJoinRequest.setActorClass('emma');

        await actorSession.joinTrial(trialJoinRequest);
        await actorSession.sendAction(new EmmaAction());

        for await (const {
          observation,
          message,
          reward,
        } of actorSession.eventLoop()) {
          if (observation !== null) {
            logger.info(observation);
            const action = new EmmaAction();
            await actorSession.sendAction(action);
          }
          if (message !== null) {
            logger.info(message);
          }

          if (reward !== null) {
            logger.info(reward);
          }
          actorSession.stop();
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
          setTimeout(() => resolve(response), 3000),
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
