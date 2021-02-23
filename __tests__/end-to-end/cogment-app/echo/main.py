import asyncio

from google.protobuf.any_pb2 import Any

import cog_settings
import cogment
from data_pb2 import (
    EchoAction,
    Message,
)


async def echo(actor_session):
    actor_session.start()

    async for event in actor_session.event_loop():
        try:
            if "message" in event:
                (sender, msg) = event["message"]
                message = Message()
                msg.Unpack(message)

                print(
                    f"{actor_session.name} received a message from {sender}: {message}"
                )
                actor_session.send_message(Message(response=message.request), [sender])
            if "observation" in event:
                observation = event["observation"]
                print(
                    f"{actor_session.name} received observation '{observation.request}' with "
                    f"timestamp {observation.timestamp}"
                )
                action = EchoAction(response=observation.request)
                actor_session.do_action(action)
            if "reward" in event:
                reward = event["reward"]
                print(f"{actor_session.name} received a reward")

            if "final_data" in event:
                final_data = event["final_data"]
                for observation in final_data.observations:
                    print(
                        f"'{actor_session.name}' received a final observation: '{observation}'"
                    )
                for reward in final_data.rewards:
                    print(
                        f"'{actor_session.name}' received a final reward for tick #{reward.tick_id}: {reward.value}/{reward.confidence}"
                    )
                for message in final_data.messages:
                    (sender, message) = message
                    print(
                        f"'{actor_session.name}' received a final message from '{sender}': - '{message}'"
                    )

        except Exception as err:
            print(err)


async def main():
    print("Echo actor service up and running.")

    context = cogment.Context(cog_settings=cog_settings, user_id="cogment-app")
    context.register_actor(
        impl=echo,
        impl_name="echo",
        actor_classes=[
            "echo",
        ],
    )

    await context.serve_all_registered(cogment.ServedEndpoint(port=9000))


if __name__ == "__main__":
    asyncio.run(main())
