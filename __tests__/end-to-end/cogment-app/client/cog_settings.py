import cogment as _cog
from types import SimpleNamespace
from typing import List

import data_pb2 as data_pb


protolib = "data_pb2"

_client_class = _cog.actor.ActorClass(
    id="client",
    config_type=None,
    action_space=data_pb.ClientAction,
    observation_space=data_pb.Observation,
    observation_delta=data_pb.Observation,
    observation_delta_apply_fn=_cog.delta_encoding._apply_delta_replace,
    feedback_space=None
)

_echo_class = _cog.actor.ActorClass(
    id="echo",
    config_type=None,
    action_space=data_pb.EchoAction,
    observation_space=data_pb.Observation,
    observation_delta=data_pb.Observation,
    observation_delta_apply_fn=_cog.delta_encoding._apply_delta_replace,
    feedback_space=None
)


actor_classes = _cog.actor.ActorClassList(
    _client_class,
    _echo_class,
)

trial = SimpleNamespace(config_type=data_pb.TrialConfig)

# Environment
environment = SimpleNamespace(config_type=data_pb.EnvConfig)


class ActionsTable:
    client: List[data_pb.ClientAction]
    echo: List[data_pb.EchoAction]

    def __init__(self, trial):
        self.client = [data_pb.ClientAction() for _ in range(trial.actor_counts[0])]
        self.echo = [data_pb.EchoAction() for _ in range(trial.actor_counts[1])]

    def all_actions(self):
        return self.client + self.echo
