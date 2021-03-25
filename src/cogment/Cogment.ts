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
import {getLogger} from '../lib/Logger';
import {
  TrialActionReply,
  TrialActionRequest,
  TrialListEntry,
  TrialListRequest,
} from './api/orchestrator_pb';
import {
  ClientActor,
  ClientActorClient,
  TrialLifecycle,
  TrialLifecycleClient,
} from './api/orchestrator_pb_service';
import {CogmentService} from './CogmentService';
import {CogSettings} from './types';

const logger = getLogger();

/**
 * Creates a new {@link CogmentService} from a generated {@link CogSettings | 'cog_settings.ts'}. Optionally pass
 * transports used by clients.
 *
 * @example Instantiating the `cogment` API.
 * ```typescript
 * import {createService} from 'cogment';
 * import cogSettings from 'CogSettings';
 *
 * const cogment = createService(cogSettings);
 * ```
 *
 * @param cogSettings - Settings loaded from the generated `cog_settings.js` file.
 * @param grpcURL - HTTP(S) url of grpc-web reverse proxy to orchestrator.
 * @param unaryTransportFactory - A `grpc.TransportFactory` used to make unary (non-streaming) requests to the backend.
 * @param streamingTransportFactory - A `grpc.TransportFactory` used to instantiate streaming connections to the
 *   backend.
 *
 * @public
 * @beta
 */
export function createService({
  cogSettings,
  // eslint-disable-next-line compat/compat
  grpcURL = `//${window.location.hostname}:8080`,
  unaryTransportFactory = grpc.CrossBrowserHttpTransport({
    withCredentials: false,
  }),
  streamingTransportFactory = grpc.WebsocketTransport(),
}: {
  cogSettings: CogSettings;
  grpcURL: string;
  unaryTransportFactory?: grpc.TransportFactory;
  streamingTransportFactory?: grpc.TransportFactory;
}): CogmentService {
  logger.debug('Creating new service with settings %s', cogSettings);
  const trialLifecycleClient: TrialLifecycleClient = new TrialLifecycleClient(
    grpcURL,
    {
      transport: unaryTransportFactory,
    },
  );
  const clientActorClient: ClientActorClient = new ClientActorClient(grpcURL, {
    transport: streamingTransportFactory,
  });

  const actionStreamClient = grpc.client<
    TrialActionRequest,
    TrialActionReply,
    typeof ClientActor.ActionStream
  >(ClientActor.ActionStream, {
    host: grpcURL,
    transport: streamingTransportFactory,
  });

  const watchTrialsClient = grpc.client<
    TrialListRequest,
    TrialListEntry,
    typeof TrialLifecycle.WatchTrials
  >(TrialLifecycle.WatchTrials, {
    host: grpcURL,
    transport: streamingTransportFactory,
  });

  return new CogmentService(
    cogSettings,
    trialLifecycleClient,
    clientActorClient,
    actionStreamClient,
    watchTrialsClient,
  );
}

export interface CreateServiceOptions {
  cogSettings: CogSettings;
  grpcURL?: string;
  unaryTransportFactory?: grpc.TransportFactory;
  streamingTransportFactory?: grpc.TransportFactory;
}
