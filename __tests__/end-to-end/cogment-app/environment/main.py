import asyncio
import time

import cogment

import cog_settings
from data_pb2 import Observation


async def environment(environment_session):
    print("environment starting")
    print("environment_session.config", environment_session.config)

    # Start the trial and send that observation to all actors
    environment_session.start([("*", Observation(timestamp=int(time.time() * 1000)))])

    suffix = "foo"

    async for event in environment_session.event_loop():
        print("Environment started")
        if event.actions:
            actions = event.actions
            print(f"environment received actions")
            observation = Observation(timestamp=int(time.time() * 1000))
            for actor, action in zip(environment_session.get_active_actors(), actions):
                print(f"actor '{actor.actor_name}' did action '{action}'")

                if hasattr(action.action, "request"):
                    observation.request = action.action.request
                elif hasattr(action.action, "response"):
                    observation.response = f"{action.action.response}{suffix}"
                else:
                    print(f"Unknown action, expecting request or response properties")

            environment_session.produce_observations([("*", observation)])
        # for message in event.messages:
        #     (msg, sender) = message
        #     print(f"environment received message - {msg} from sender {sender}")

    print("environment end")


async def main():
    print("Environment service up and running.")

    context = cogment.Context(cog_settings=cog_settings, user_id="cogment-app")

    context.register_environment(impl=environment)

    await context.serve_all_registered(cogment.ServedEndpoint(port=9000))


if __name__ == "__main__":
    asyncio.run(main())
