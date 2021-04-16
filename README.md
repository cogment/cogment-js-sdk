# [**@cogment/cogment-js-sdk**](https://github.com/cogment/cogment-js-sdk)

[![cogment](https://img.shields.io/badge/npm-%40cogment%2Fcogment--js--sdk-brightgreen)][npm-cogment]
[![npm](https://img.shields.io/npm/dw/@cogment/cogment-js-sdk)][npm-cogment]
[![npm](https://img.shields.io/npm/v/@cogment/cogment-js-sdk)][npm-cogment]
[![npm collaborators](https://img.shields.io/npm/collaborators/@cogment/cogment-js-sdk)][npm-cogment]
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@cogment/cogment-js-sdk)][npm-cogment]

[![GitHub commit activity](https://img.shields.io/github/commit-activity/w/cogment/cogment-js-sdk?style=social&logo=github)][repo]
[![GitHub forks](https://img.shields.io/github/forks/cogment/cogment-js-sdk?style=social)][repo]
[![GitHub Repo stars](https://img.shields.io/github/stars/cogment/cogment-js-sdk?style=social)][repo]
[![GitHub contributors](https://img.shields.io/github/contributors/cogment/cogment-js-sdk?style=social&logo=github)][repo]

[![License](https://img.shields.io/npm/l/@cogment/cogment-js-sdk)][license]
![OSS Lifecycle](https://img.shields.io/osslifecycle/cogment/cogment-js-sdk)

![node-current (scoped)](https://img.shields.io/node/v/@cogment/cogment-js-sdk)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)][code-of-conduct]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![Discord](https://img.shields.io/discord/739822842450935963?label=Discord&logo=Discord&style=plastic)

## Table of contents

- [Links](#links)
- [Usage](#usage)
- [Docker](#docker)
  - [Docker Setup](#docker-setup)
  - [Docker Testing](#docker-testing)
- [Non-docker](#non-docker)
  - [Setup](#setup)
  - [Testing](#testing)

## Links

- [cogment.ai][cogment.ai]
- [Repository][repo]
- [API Documentation][api-docs]
- [Code of Conduct][code-of-conduct]
- [License][license]
- [Changelog][changelog]
- [Contributing][contributing]
- [Open Core Development][opencore-development]
- [Coding guidelines][codeguidelines]
- [Updating Cogment][updating-cogment]
- [Sentimental Versioning][sentimental-versioning]
- [Test Report][tests]
- [Coverage Report][coverage]
- [Webpack Bundle Report][webpack]
- [cogjs-cli][cogjs-cli]
- [Semantic Versioning][semver.org]

## Usage

Install the package:

```shell script
npm install @cogment/cogment-js-sdk
```

The [test suite][test-suite] [embeds][cogment-app] a working [Cogment
application][docs.cogment.ai]. Parts of the example application
pertinent to the js-sdk test suite:

- [an echo actor](/__tests__/end-to-end/cogment-app/echo/)
- [an environment](/__tests__/end-to-end/cogment-app/environment/)
- [configuration pre-hook](/__tests__/end-to-end/cogment-app/configurator)
  \- a gRPC service, configured in cogment.yaml
- [cogment.yaml](/__tests__/end-to-end/cogment-app/cogment.yaml) - the
  configuration entrypoint into Cogment and is used to generate language
  specific static configuration files.
- [data.proto](/__tests__/end-to-end/cogment-app/data.proto) -
  application specific protobufs that represent trial entities (eg:
  observation space, actor action space, etc) in addition to other
  utility protobufs needed by the user, you!

The [ActorSession.test.ts](/__tests__/ActorSession.test.ts) is the most
feature complete example of a working cogment application and is
documented to be read as such.

Examples follow.

### Instantiate a CogmentService

```typescript
import {createService} from 'cogment';
import cogSettings from './CogSettings';

const cogmentService = createService({
  cogSettings,
});
```

### Start and stop a trial

```typescript
import {createService} from 'cogment';
import cogSettings from './CogSettings';

const cogmentService = createService({
  cogSettings,
});

const trialController = cogmentService.createTrialController();

const {trialId} = await trialController.startTrial('unique-id');
return trialController.terminateTrial(trialId);
```

### Register an actor and join the trial

```typescript
import {createService, TrialActor} from 'cogment';
import cogSettings from './CogSettings';
import {ClientAction, Observation} from './data_pb';

const cogmentService = createService({
  cogSettings,
});

const trialActor: TrialActor = {
  name: 'client_actor',
  actorClass: 'client',
};

cogmentService.registerActor<ClientAction, Observation, never>(
  trialActor,
  async (actorSession) => {
    // Actor implementation here.
  },
);

const trialController = cogmentService.createTrialController();
const {trialId} = await trialController.startTrial(trialActor.name);
await trialController.joinTrial(trialId, trialActor);
return trialController.terminateTrial(trialId);
```

### Watch for trial state changes

```typescript
import {createService} from 'cogment';
import cogSettings from './CogSettings';

const cogmentService = createService({
  cogSettings,
});

const trialController = cogmentService.createTrialController();

for await (const trialListEntry of trialController.watchTrials([
  0,
  1,
  2,
  3,
  4,
  5,
])) {
  // Do stuff!
}
```

## Development Workflow

### Docker

#### Docker Setup

1. Clone the repository:
   ```shell script
   git clone https://github.com/cogment/cogment-js-sdk.git
   ```
2. Build the docker container:
   ```shell script
   docker-compose build cogment-js-sdk
   ```
3. Initialize the repository:
   ```shell script
   docker-compose run cogment-js-sdk npm run init
   ```

#### Docker Testing

1. Start the embeded cogment app
   ```shell script
   bin/up.bash
   ```
2. Run all tests
   ```shell script
   docker-compose run cogment-js-sdk npm run test
   ```

### Non-docker

#### Setup

1. Clone the repository:
   ```shell script
   git clone https://github.com/cogment/cogment-js-sdk.git
   ```
2. Install node (check [.node-version](/.node-version) for the
   appropriate version). The recommended way to manage node
   distributions is through
   [nvm (node version manager)](https://github.com/nvm-sh/nvm):
   ```shell script
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
   source ~/.nvm/nvm.sh
   cd /path/to/cogment-js-sdk
   nvm install
   ```
3. Initialize the repository:
   ```shell script
   npm run init
   ```

#### Testing

1. Change the contents of .cogmentrc.js from
   ```
   module.exports = {
     connection: {
       http: 'http://grpcwebproxy:8080',
     },
     logger: {
       level: 'debug',
     },
   };
   ```
   To
   ```
   module.exports = {
     connection: {
       http: 'http://localhost:8080',
     },
     logger: {
       level: 'debug',
     },
   };
   ```
2. Start the embeded cogment app
   ```shell script
   bin/up.bash
   ```
3. Do one of the following:

- To run the test suite once:
  ```shell script
  npm run test
  ```
- To watch for changes and rerun tests automatically in your console:
  ```shell script
  npm run test:watch
  ```
- To launch the [majestic test ui][majestic] to run / watch / visualize
  tests:
  ```shell script
  npm run test:ui
  ```

[api-docs]: https://ai-r.gitlab.io/cogment-js-sdk 'api-docs'
[changelog]: /CHANGELOG.md 'changelog'
[code-of-conduct]: /CODE_OF_CONDUCT.md
[codeguidelines]: /docs/codeguidelines.md
[cogjs-cli]: /cli
[cogment-app]: /__tests__/end-to-end/cogment-app/
[cogment.ai]: https://cogment.ai 'cogment.ai'
[contributing]: /CONTRIBUTING.md
[coverage]: https://ai-r.gitlab.io/cogment-js-sdk/coverage/lcov-report 'coverage report'
[docs.cogment.ai]: https://docs.cogment.ai/
[license]: /LICENSE.md 'license'
[majestic]: https://github.com/Raathigesh/majestic 'majestic'
[npm-cogment]: https://www.npmjs.com/package/cogment 'npm-cogment'
[opencore-development]: /docs/opencore-development.md
[repo]: https://github.com/cogment/cogment-js-sdk/ 'Repository'
[semver.org]: https://semver.org
[sentimental-versioning]: http://sentimentalversioning.org/
[test-suite]: /__tests__/
[tests]: https://ai-r.gitlab.io/cogment-js-sdk/allure
[updating-cogment]: /docs/updating-cogment.md
[webpack]: https://ai-r.gitlab.io/cogment-js-sdk/webpack/cjs
