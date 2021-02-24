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
import {createService} from '../../src/cogment';
import {
  Message,
  VersionInfo,
  VersionRequest,
} from '../../src/cogment/api/common_pb';
import {TrialLifecycle} from '../../src/cogment/api/orchestrator_pb_service';
import {config} from '../../src/cogment/lib/Config';
import {getLogger} from '../../src/cogment/lib/Logger';
import {TrialActor} from '../../src/types';
import cogSettings from './cogment-app/webapp/src/CogSettings';
import {ClientAction, Observation} from './cogment-app/webapp/src/data_pb';

const logger = getLogger('cogment').childLogger('__tests__/end-to-end');

describe('grpc.WebsocketTransport', () => {
  test('is able to make a unary call to `cogment.TrialLifecycle.Version`', async () => {
    const websocketTransport = grpc.WebsocketTransport();
    const versionClient = grpc.client<
      VersionRequest,
      VersionInfo,
      typeof TrialLifecycle.Version
    >(TrialLifecycle.Version, {
      host: config.connection.http,
      transport: websocketTransport,
    });

    const mockOnMessageCallback = jest.fn((message: VersionInfo) => {
      expect(message).toBeInstanceOf(VersionInfo);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockOnHeadersCallback = jest.fn(() => {});

    versionClient.onMessage(mockOnMessageCallback);
    versionClient.onMessage(mockOnMessageCallback);
    versionClient.onHeaders(mockOnHeadersCallback);
    // eslint-disable-next-line compat/compat
    await new Promise<void>((resolve) => {
      versionClient.onEnd((code) => {
        expect(code).toBe(0);
        resolve();
      });

      versionClient.start();
      versionClient.send(new VersionRequest());
      versionClient.finishSend();
    });

    expect(mockOnMessageCallback.mock.calls).toHaveLength(2);
    expect(mockOnHeadersCallback.mock.calls).toHaveLength(1);
  });
});

describe('a cogment-app', () => {
  test('runs', async () => {
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
    await trialController.joinTrial(trialId, trialActor);
    // eslint-disable-next-line compat/compat
    await new Promise((resolve) => setTimeout(resolve, 500));
    return trialController.terminateTrial(trialId);
  });
});
