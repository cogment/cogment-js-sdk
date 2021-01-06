#   Copyright 2021 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
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

import traceback
from cogment import TrialHooks, GrpcServer
from types import SimpleNamespace as ns

TIME_URL = "grpc://time:9000"


class Supervisor(TrialHooks):
    VERSIONS = {"poker": "1.0.0"}

    @staticmethod
    def pre_trial(trial_id, user_id, trial_params):

        actor_settings = {
            "time": ns(actor_class="time", end_point=TIME_URL, config=None),
        }

        try:
            trial_config = trial_params.trial_config
            actors = [ns(actor_class="emma", endpoint="human", config=None)]

            # modify following to retrieve config info and create actors list
            # for ??? in trial_config.env_config.???:
            #    actors.append(actor_settings[???])

            trial_params.actors = actors

            trial_params.environment.config = trial_config.env_config

            return trial_params
        except Exception:
            traceback.print_exc()
            raise


if __name__ == "__main__":
    server = GrpcServer(Configurator, cog_settings)
    server.serve()
