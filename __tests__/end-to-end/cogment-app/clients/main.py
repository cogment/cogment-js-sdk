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

import cog_settings

from data_pb2 import EmmaAction

from cogment.client import Connection

# Callback received message
def handle_messages(sender, msg):
    print(f"Client received message - {msg} from sender {sender}")


# Create a connection to the Orchestrator serving this project
conn = Connection(cog_settings, "orchestrator:9000")

# Initiate a trial
trial = conn.start_trial(cog_settings.actor_classes.emma)

# Perform actions, and get observations
observation = trial.do_action(EmmaAction(), on_message=handle_messages)

# cleanup
trial.end()
