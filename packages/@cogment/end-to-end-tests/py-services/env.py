import asyncio
import time
import logging

import cog_settings
import cogment

from data_pb2 import Observation

async def environment(environment_session):
    logging.info(f"environment [{environment_session.name}] joined trial [{environment_session.get_trial_id()}]")

    # Start the trial and send that observation to all actors
    environment_session.start([("*", Observation(timestamp=int(time.time() * 1000), request="none"))])

    async for event in environment_session.all_events():
        if event.actions:
            actions = event.actions
            logging.info(f"[{environment_session.name}] received actions")
            observation = Observation(timestamp=int(time.time() * 1000))
            for actor, action in zip(environment_session.get_active_actors(), actions):
                logging.info(f"[{environment_session.name}] actor [{actor.actor_name}] did action [{action}]")

                if hasattr(action.action, "request"):
                    observation.request = action.action.request
                elif hasattr(action.action, "response"):
                    observation.response = action.action.response
                else:
                    logging.info("Unknown action, expecting request or response properties")

            if environment_session.get_tick_id() > 40:
                environment_session.end([("*", observation)])
            else:
                environment_session.produce_observations([("*", observation)])

        for message in event.messages:
            (msg, sender) = message
            print(f"[{environment_session.name}] actor [{sender}] sent message [{msg}]")


async def main():
    logging.basicConfig(level=logging.INFO)
    logging.info("environment service starting...")

    context = cogment.Context(cog_settings=cog_settings, user_id="cogment-app")

    context.register_environment(impl=environment)

    await context.serve_all_registered(cogment.ServedEndpoint(port=9001), prometheus_port=None)


if __name__ == "__main__":
    asyncio.run(main())
