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
import { ActorSession, AnyPB, Context, EventType, MessageBase, Reward, TrialState } from "@cogment/cogment-js-sdk";
import { cogSettings } from "../src/CogSettings";
import { cogment_app as PB } from "../src/data_pb";

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || "http://localhost:8081";

jest.setTimeout(30000);

describe("a full cogment app", () => {
  test("a full trial", async () => {
    const observations: PB.Observation[] = [];
    const messagesList: (MessageBase | AnyPB)[] = [];
    const rewardsList: Reward[] = [];

    let trialMiddleResolve = () => {};
    const trialMiddlePromise = new Promise<void>((resolve) => {
      trialMiddleResolve = resolve;
    });
    let trialEndResolve = () => {};
    const trialEndPromise = new Promise<void>((resolve) => {
      trialEndResolve = resolve;
    });
    let trialTerminateResolve = () => {};
    const trialTerminatePromise = new Promise<void>((resolve) => {
      trialTerminateResolve = resolve;
    });

    const actorImplementation = async (actorSession: ActorSession<PB.ClientAction, PB.Observation>) => {
      actorSession.start();

      let iterations = 0;

      for await (const { observation, messages, rewards, type } of actorSession.eventLoop()) {
        if (observation) {
          observations.push(observation);
          const action = new PB.ClientAction();
          action.request = "ping";
          iterations++;
          if (iterations === 10) {
            console.log("Resolving middle promise");
            trialMiddleResolve();
          }
          if (iterations === 20) {
            console.log("Resolving end promise");
            trialEndResolve();
          }

          const message = new PB.Message({ request: "foo" });
          const userData = new PB.UserData({ aBool: false, aFloat: 0.5 });
          if (type !== EventType.ENDING && type !== EventType.FINAL) {
            actorSession.sendMessage(message, ["echo_echo_1"]);
            actorSession.doAction(action);
            actorSession.addReward(30, 0.5, ["client_actor"], -1, userData);
          }
        }
        if (messages.length) {
          messages.forEach((message) => {
            messagesList.push(message);
          });
        }

        if (rewards.length) {
          rewardsList.push(...rewards);
        }
      }
      trialTerminateResolve();
    };

    const context = new Context<PB.ClientAction, PB.Observation>(cogSettings, "test_client");
    context.registerActor(actorImplementation, "client_actor", "client");

    const controller = context.getController(ORCHESTRATOR_URL);
    expect(controller).not.toBeNull();

    const trialId = await controller.startTrial();
    expect(trialId).not.toBeNull();

    await context.joinTrial(trialId, ORCHESTRATOR_URL, "client_actor");

    await trialMiddlePromise;
    const trialInfos = await controller.getTrialInfo([trialId]);
    expect(trialInfos).toHaveLength(1);
    const thisTrial = trialInfos.find((trial) => trial.trialId === trialId);
    expect(thisTrial).toBeDefined();
    expect(thisTrial?.trialId).toBe(trialId);
    expect(thisTrial?.tickId).toBeGreaterThanOrEqual(9);

    await trialEndPromise;
    await controller.terminateTrial([trialId], false);

    await trialTerminatePromise;

    expect(observations).not.toHaveLength(0);
    expect(messagesList).not.toHaveLength(0);
    expect(rewardsList).not.toHaveLength(0);
    expect(observations[2].response).toBe("ping");
  });
});
