import asyncio
import logging

import cogment

import cog_settings
from data_pb2 import EchoAction, Message


async def echo(actor_session):
    logging.info(f"echo actor [{actor_session.name}] joined trial [{actor_session.get_trial_id()}]")
    actor_session.start()

    async for event in actor_session.all_events():
        for message in event.messages:
            sender = message.sender_name
            msg = message.payload

            message_parsed = Message()
            msg.Unpack(message_parsed)

            logging.info(
                f"[{actor_session.name}] received a message from [{sender}]: [{message_parsed}]"
            )
            actor_session.send_message(Message(response=message_parsed.request), [sender])
        if event.observation:
            observation = event.observation

            logging.info(
                f"[{actor_session.name}] received observation [{observation.observation.request}] with " +
                f"timestamp [{observation.observation.timestamp}]"
            )
            if event.type == cogment.EventType.ACTIVE:
                action = EchoAction(response=observation.observation.request)
                actor_session.do_action(action)

                logging.info(f"[{actor_session.name}] sent action [{action.response}]")


async def main():
    logging.basicConfig(level=logging.INFO)
    logging.info(f"echo actor service starting...")

    context = cogment.Context(cog_settings=cog_settings, user_id="cogment-app")
    context.register_actor(
        impl=echo,
        impl_name="echo",
        actor_classes=[
            "echo",
        ],
    )

    await context.serve_all_registered(cogment.ServedEndpoint(port=9002), prometheus_port=None)


if __name__ == "__main__":
    asyncio.run(main())
