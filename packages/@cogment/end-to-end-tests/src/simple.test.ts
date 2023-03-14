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
import {
  ActorSession,
  AnyPB,
  Context,
  Controller,
  EventType,
  MessageBase,
  Reward,
  TrialInfo,
  TrialState,
} from "@cogment/cogment-js-sdk";
import { cogSettings } from "./CogSettings";
import { cogment_app as PB } from "./data_pb";

const ORCHESTRATOR_URL =
  process.env.ORCHESTRATOR_URL || "http://localhost:8081";

describe("a simple cogment app", () => {
  test("simple trial", async () => {

    const context = new Context<PB.ClientAction, PB.Observation>(
      cogSettings,
      "test_client"
    );
    expect(context).not.toBeNull();

    let trialEndResolve = () => {};
    const trialEndPromise = new Promise<void>((resolve) => {
      trialEndResolve = resolve;
    });
    let actorImplementationCallsCount = 0;
    const actorImplementation = async (
      actorSession: ActorSession<PB.ClientAction, PB.Observation>
    ) => {
      actorImplementationCallsCount+=1;
      actorSession.start();

      let previousTickRequest = ""
      let previousPreviousTickRequest = ""

      for await (const {
        observation,
        messages,
        rewards,
        type,
      } of actorSession.eventLoop()) {
        expect(messages).toHaveLength(0);
        expect(rewards).toHaveLength(0);

        if (observation) {
          if (previousTickRequest !== "") {
            expect(observation.request).toEqual(previousTickRequest);
            if (previousPreviousTickRequest !== "") {
              expect(observation.response).toEqual(previousPreviousTickRequest);
            }
          }

          if (type === EventType.ACTIVE) {
            const request = `request_at_${(new Date()).toISOString()}`;
            const action = new PB.ClientAction({request: request});
            actorSession.doAction(action);

            previousPreviousTickRequest = previousTickRequest;
            previousTickRequest = request;
          }
        }
      }

      trialEndResolve();
    };
    context.registerActor(actorImplementation, "client_actor", "client");
    expect(actorImplementationCallsCount).toEqual(0);

    const controller = context.getController(ORCHESTRATOR_URL);
    expect(controller).not.toBeNull();

    const trialId = await controller.startTrial();
    expect(trialId).not.toBeNull();

    await context.joinTrial(trialId, ORCHESTRATOR_URL, "client_actor");

    expect(actorImplementationCallsCount).toEqual(1);

    await trialEndPromise;
  });
});
