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
import asyncio
import cogment

import cog_settings


async def pre_trial_hook(session):
    if session.trial_config:
        session.environment_config.suffix = session.trial_config.env_config.suffix
    return session


async def main():
    cog_context = cogment.Context(cog_settings=cog_settings, user_id="configurator")
    cog_context.register_pre_trial_hook(pre_trial_hook)
    cogment_done = asyncio.create_task(cog_context.serve_all_registered(port=9000))

    await asyncio.gather(cogment_done)


if __name__ == "__main__":
    asyncio.run(main())
