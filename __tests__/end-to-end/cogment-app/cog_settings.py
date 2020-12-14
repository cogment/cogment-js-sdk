import cogment as _cog
from types import SimpleNamespace
from typing import List

import data_pb2 as data_pb


protolib = "data_pb2"

_emma_class = _cog.actor.ActorClass(
    id="emma",
    config_type=None,
    action_space=data_pb.EmmaAction,
    observation_space=data_pb.Observation,
    observation_delta=data_pb.Observation,
    observation_delta_apply_fn=_cog.delta_encoding._apply_delta_replace,
    feedback_space=None
)

_time_class = _cog.actor.ActorClass(
    id="time",
    config_type=None,
    action_space=data_pb.TimeAction,
    observation_space=data_pb.Observation,
    observation_delta=data_pb.Observation,
    observation_delta_apply_fn=_cog.delta_encoding._apply_delta_replace,
    feedback_space=None
)


actor_classes = _cog.actor.ActorClassList(
    _emma_class,
    _time_class,
)

trial = SimpleNamespace(config_type=None)

# Environment
environment = SimpleNamespace(config_type=data_pb.EnvConfig)


class ActionsTable:
    emma: List[data_pb.EmmaAction]
    time: List[data_pb.TimeAction]

    def __init__(self, trial):
        self.emma = [data_pb.EmmaAction() for _ in range(trial.actor_counts[0])]
        self.time = [data_pb.TimeAction() for _ in range(trial.actor_counts[1])]

    def all_actions(self):
        return self.emma + self.time

