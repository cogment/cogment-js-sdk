#   Copyright 2020 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
import logging

import cogment
import cog_settings

import data_pb2
import asyncio


async def environment(environment_session):

    environment_session.start([("*", data_pb2.Observation(time=0))])
    logging.info("[Environment] trial %s starts!", environment_session.get_trial_id())

    async for event in environment_session.event_loop():
        print(event)
        if "actions" in event:
            [p1] = environment_session.get_active_actors()
            [p1_move] = [action.move for action in event["actions"].player]

            logging.info(f"Received time of %f from '%s'", p1_move.time, p1.actor_name)

            # if p1_move == p2_move:
            #     logging.ingo("Draw!")
            # elif (
            #     (p1_move == ROCK and p2_move == SCISSORS)
            #     or (p1_move == PAPER and p2_move == ROCK)
            #     or (p1_move == SCISSORS and p2_move == PAPER)
            # ):
            #     logging.ingo(f"Player 1 '{p1.actor_name}' wins!")
            #     p1_score += 1
            # else:
            #     logging.ingo(f"Player 2 '{p2.actor_name}' wins!")
            #     p2_score += 1
            #
            # if p1_score >= TARGET_SCORE:
            #     logging.ingo(f"Player 1 '{p1.actor_name}' wins the match!")
            #     environment_session.end(
            #         observations=[
            #             ("*", Observation(p1_score=p1_score, p2_score=p2_score))
            #         ]
            #     )
            # elif p2_score >= TARGET_SCORE:
            #     logging.ingo(f"Player 2 '{p2.actor_name}' wins the match!")
            #     environment_session.end(
            #         observations=[
            #             ("*", Observation(p1_score=p1_score, p2_score=p2_score))
            #         ]
            #     )
            # else:
            environment_session.produce_observations(
                [("*", data_pb2.Observation(time=p1_move.time))]
            )

    logging.info("[Environment] trial %s over", environment_session.get_trial_id())


async def main():
    logging.info("Environment service up and running.")

    context = cogment.Context(cog_settings=cog_settings, user_id="time")

    context.register_environment(impl=environment)

    await context.serve_all_registered(port=9000)


if __name__ == "__main__":
    asyncio.run(main())
