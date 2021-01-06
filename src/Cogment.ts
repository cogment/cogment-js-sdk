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

/**
 * A library for interacting with the {@link https://cogment.ai | cogment.ai} framework.
 *
 * @packageDocumentation
 */

import {grpc} from '@improbable-eng/grpc-web';
import {CogSettings} from './@types/cogment';
import {
  TrialActionReply,
  TrialActionRequest,
} from './cogment/api/orchestrator_pb';
import {
  ActorEndpoint,
  ActorEndpointClient,
  TrialLifecycleClient,
} from './cogment/api/orchestrator_pb_service';
import {CogmentService} from './CogmentService';
import {getLogger} from './lib/Logger';

const logger = getLogger();

/**
 * Creates a new {@link CogmentService} from a generated {@link CogSettings | cog_settings.js}.
 *
 * Optionally pass transports used by clients.
 *
 * @example
 * Instantiating the `cogment` API.
 * ```typescript
 * import {createService} from 'cogment';
 * import cogSettings from 'cog_settings';
 *
 * const cogment = createService(cogSettings);
 * ```
 *
 * @public
 * @beta
 *
 * @param cogSettings - Settings loaded from the generated `cog_settings.js` file.
 * @param unaryTransportFactory - A `grpc.TransportFactory` used to make unary (non-streaming) requests to the backend. Defaults to {@link @improbable-eng/grpc-web#CrossBrowserHttpTransport}.
 * @param streamingTransportFactory - A `grpc.TransportFactory` used to instantiate streaming connections to the backend. Defaults to {@link @improbable-eng/grpc-web#WebsocketTransport}.
 * @returns A {@link CogmentService} configured with the given {@link CogSettings} and transports.
 */
export function createService(
  cogSettings: CogSettings,
  unaryTransportFactory: grpc.TransportFactory = grpc.CrossBrowserHttpTransport(
    {
      withCredentials: false,
    },
  ),
  streamingTransportFactory: grpc.TransportFactory = grpc.WebsocketTransport(),
): CogmentService {
  logger.debug('Creating new service with settings %s', cogSettings);
  const trialLifecycleClient: TrialLifecycleClient = new TrialLifecycleClient(
    cogSettings.connection.http,
    {
      transport: unaryTransportFactory,
    },
  );
  const actorEndpointClient: ActorEndpointClient = new ActorEndpointClient(
    cogSettings.connection.http,
    {
      transport: streamingTransportFactory,
    },
  );

  const actionStreamClient = grpc.client<
    TrialActionRequest,
    TrialActionReply,
    typeof ActorEndpoint.ActionStream
  >(ActorEndpoint.ActionStream, {
    host: cogSettings.connection.http,
    transport: streamingTransportFactory,
  });

  return new CogmentService(
    cogSettings,
    trialLifecycleClient,
    actorEndpointClient,
    actionStreamClient,
  );
}
