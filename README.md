# cogment-js-sdk

[![Retrieve from npm](https://img.shields.io/badge/npm-%40cogment%2Fcogment--js--sdk-brightgreen)](https://www.npmjs.com/package/@cogment/cogment-js-sdk) [![Apache 2 License](https://img.shields.io/badge/license-Apache%202-green)](./LICENSE) [![Changelog](https://img.shields.io/badge/-Changelog%20-blueviolet)](./CHANGELOG.md)

![OSS Lifecycle](https://img.shields.io/osslifecycle/cogment/cogment-js-sdk)
![node-current (scoped)](https://img.shields.io/node/v/@cogment/cogment-js-sdk)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)][code-of-conduct]

[Cogment](https://cogment.ai) is an innovative open source AI platform designed to leverage the advent of AI to benefit humankind through human-AI collaboration developed by [AI Redefined](https://ai-r.com). Cogment enables AI researchers and engineers to build, train and operate AI agents in simulated or real environments shared with humans. For the full user documentation visit <https://docs.cogment.ai>

This module, `cogment-js-sdk`, is the Javascript SDK for making use of Cogment when working with Javascript. It's full documentation can be consulted at <https://docs.cogment.ai/cogment/cogment-api-reference/javascript/modules/>.

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
- [Webpack Bundle Report][webpack]
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
- [cogment.yaml](/__tests__/end-to-end/cogment-app/cogment.yaml) - the
  configuration entrypoint into Cogment and is used to generate language
  specific static configuration files.
- [data.proto](/__tests__/end-to-end/cogment-app/data.proto) -
  application specific protobufs that represent trial entities (eg:
  observation space, actor action space, etc) in addition to other
  utility protobufs needed by the user, you!

The [index.test.ts](/__tests__/end-to-end/index.test.ts) is the most
feature complete example of a working cogment application and is
documented to be read as such.

Documentation available at [docs.cogment.ai](docs.cogment.ai)

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
2. Initialize the repository:
   ```shell script
   npm install
   ```

#### Testing

1. Start the embeded cogment app
   ```shell script
   bin/up.bash
   ```
2. Run the test suite:

```shell script
npm run test
```

### Release process

People having maintainers rights of the repository can follow these steps to release a version **MAJOR.MINOR.PATCH**. The versioning scheme follows [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

1. Run `./scripts/create_release_branch.sh MAJOR.MINOR.PATCH` automatically compute and update the version of the package, create the release branch and update the changelog from the commit history,
2. On the release branch, check and update the changelog if needed, update internal dependencies as described [here][updating-cogment], and make sure everything's fine on CI,
3. Run `./scripts/tag_release.sh MAJOR.MINOR.PATCH` to create the specific version section in the changelog, merge the release branch in `main`, create the release tag and update the `develop` branch with those.

The rest, publishing the packages to dockerhub and updating the mirror repositories, is handled directly by the CI.

[api-docs]: https://docs.cogment.ai/cogment/cogment-api-reference/javascript/ 'api-docs'
[changelog]: /CHANGELOG.md 'changelog'
[code-of-conduct]: /CODE_OF_CONDUCT.md
[cogment-app]: /__tests__/end-to-end/cogment-app/
[cogment.ai]: https://cogment.ai 'cogment.ai'
[contributing]: /CONTRIBUTING.md
[docs.cogment.ai]: https://docs.cogment.ai/
[license]: /LICENSE.md 'license'
[opencore-development]: /docs/opencore-development.md
[repo]: https://github.com/cogment/cogment-js-sdk/ 'Repository'
[semver.org]: https://semver.org
[sentimental-versioning]: http://sentimentalversioning.org/
[test-suite]: /__tests__/
[webpack]: https://ai-r.gitlab.io/cogment-js-sdk/webpack/cjs
