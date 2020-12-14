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

import asyncio
import logging
import time

import cog_settings
import cogment
import data_pb2


async def time_agent(actor_session):
    actor_session.start()
    logging.info(
        "[Agent '%s'] trial %s starts!",
        actor_session.name,
        actor_session.get_trial_id(),
    )

    async for event in actor_session.event_loop():
        if "observation" in event:
            next_action = data_pb2.TimeAction(time=time.time())
            logging.info(
                "[Agent '{actor_session.name}'] reporting time of %f",
                actor_session.name,
                next_action.time,
            )
            actor_session.do_action(next_action)
            logging.info("[Agent '%s'] played", actor_session.name)


async def main():
    logging.info("Agent service up and running.")

    context = cogment.Context(cog_settings=cog_settings, user_id="time")

    context.register_actor(impl=time_agent, impl_name="main", actor_classes=["time"])

    await context.serve_all_registered(port=9000)


if __name__ == "__main__":
    asyncio.run(main())
