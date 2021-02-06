import cog_settings
from data_pb2 import (
    ClientAction,
    ClientMessage,
)
from data_pb2 import TrialConfig

import cogment

import asyncio


async def client_actor_impl(actor_session):
    actor_session.start()

    counter = 0

    action = ClientAction(request=f"oh hai! {counter}")
    actor_session.do_action(action)

    async for event in actor_session.event_loop():
        if "observation" in event:
            observation = event["observation"]
            print(f"{actor_session.name} received message {observation.request}")
            action = ClientAction(request=f"oh hai! {counter}")
            actor_session.do_action(action)
            counter += 1
        if "reward" in event:
            reward = event["reward"]
            print(f"{actor_session.name} received a reward")
        if "message" in event:
            (msg, sender) = event["message"]
            print(
                f"{actor_session.name} received a message - {msg} from sender {sender}"
            )

        if not counter % 10:
            message = ClientMessage(request=f"oh hai! {counter}")
            actor_session.send_message(message, "echo")


async def main():
    print("Client up and running.")

    context = cogment.Context(cog_settings=cog_settings, user_id="cogment-app")
    context.register_actor(
        impl=client_actor_impl,
        impl_name="client_actor_impl",
        actor_classes=[
            "client",
        ],
    )

    # Create and join a new trial
    trial_id = asyncio.get_running_loop().create_future()
    trial_finished = asyncio.get_running_loop().create_future()

    async def trial_controler(control_session):
        nonlocal trial_id
        print(f"Trial '{control_session.get_trial_id()}' starts")
        trial_id.set_result(control_session.get_trial_id())
        await trial_finished
        print(f"Trial '{control_session.get_trial_id()}' terminating")
        await control_session.terminate_trial()

    trial = asyncio.create_task(
        context.start_trial(
            endpoint="orchestrator:9000",
            impl=trial_controler,
            trial_config=TrialConfig(),
        )
    )

    trial_id = await trial_id

    await context.join_trial(
        trial_id=trial_id, endpoint="orchestrator:9000", impl_name="client_actor_impl"
    )

    await trial


if __name__ == "__main__":
    asyncio.run(main())
