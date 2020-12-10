/*
 *  Copyright 2020 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as cogment from '../../src';
import spawn from 'cross-spawn';
import path from 'path';

const BIN_PATH = path.resolve(__dirname, '../../bin');
const START_ENV_PATH = path.resolve(BIN_PATH, 'start-end-to-end.bash');
const END_ENV_PATH = path.resolve(BIN_PATH, 'end-end-to-end.bash');

beforeAll(() => {
  spawn.sync(START_ENV_PATH);
});

afterAll(() => {
  spawn.sync(END_ENV_PATH);
});

describe('end-to-end environment', () => {
  it('starts docker containers', () => {
    const result = spawn.sync('docker', ['ps'], {stdio: 'pipe'});
    expect(result.stdout.toString('utf8')).toMatch(/orchestrator/);
  });
});

describe('we can import the package', () => {
  it('works', () => {
    expect(cogment).toBeTruthy();
  });
});
