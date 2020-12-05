
import cog_settings
from data_pb2 import TimeAction

from cogment import Agent, GrpcServer

class Time(Agent):
    VERSIONS = {"time": "1.0.0"}
    actor_class = cog_settings.actor_classes.time

    def decide(self, observation: cog_settings.actor_classes.time.observation_space):
        print("Time decide")
        action = TimeAction()
        return action

    def reward(self, reward):
        print("Time reward")

    def on_message(self, sender, msg):
        if msg:
            print(f'Agent {self.id_in_class} received message - {msg} from sender {sender}')

    def end(self):
        print("Time end")


if __name__ == '__main__':
    server = GrpcServer(Time, cog_settings)
    server.serve()
