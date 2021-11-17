import asyncio

import cogment
from google.protobuf.any_pb2 import Any

import cog_settings
from data_pb2 import EchoAction, Message


async def echo(actor_session):
    print("Echo actor running in trial.")
    actor_session.start()

    async for event in actor_session.event_loop():
        try:
            for message in event.messages:
                sender = message.sender_name
                msg = message.payload
                
                message_parsed = Message()
                msg.Unpack(message_parsed)

                print(
                    f"{actor_session.name} received a message from {sender}: {message_parsed}"
                )
                actor_session.send_message(Message(response=message_parsed.request), [sender])
            if event.observation:
                observation = event.observation

                print(
                    f"{actor_session.name} received observation '{observation.snapshot.request}' with "
                    f"timestamp {observation.snapshot.timestamp}"
                )
                action = EchoAction(response=observation.snapshot.request)
                actor_session.do_action(action)

            # TODO: add test for final data and rewards

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
