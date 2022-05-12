# cogment-js-sdk

[![Retrieve from npm](https://img.shields.io/badge/npm-%40cogment%2Fcogment--js--sdk-brightgreen)](https://www.npmjs.com/package/@cogment/cogment-js-sdk) [![Apache 2 License](https://img.shields.io/badge/license-Apache%202-green)](./LICENSE) [![Changelog](https://img.shields.io/badge/-Changelog%20-blueviolet)](./CHANGELOG.md)

![node-current (scoped)](https://img.shields.io/node/v/@cogment/cogment-js-sdk)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](/CODE_OF_CONDUCT.md)

[Cogment](https://cogment.ai) is an innovative open source AI platform designed to leverage the advent of AI to benefit humankind through human-AI collaboration developed by [AI Redefined](https://ai-r.com). Cogment enables AI researchers and engineers to build, train and operate AI agents in simulated or real environments shared with humans. For the full user documentation visit <https://docs.cogment.ai>

This module, `cogment-js-sdk`, is the Javascript SDK for making use of Cogment when working with Javascript. It's full documentation can be consulted at <https://cogment.ai/docs/reference/javascript>.

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

- [API Documentation][https://docs.cogment.ai/cogment/cogment-api-reference/javascript/]
- [Contributing](/CONTRIBUTING.md)
- [Developers guide](#developers)

## Usage

Install the package:

```shell script
npm install @cogment/cogment-js-sdk
```

The test suite [embeds][/__tests__/end-to-end/cogment-app/] a working Cogment
application. Parts of the example application
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

Documentation available at [docs.cogment.ai](https://docs.cogment.ai/)

## Developers

### Develop and run test in docker

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
   docker-compose run cogment-js-sdk
   ```

### Develop locally and run test using a dockerized cogment app

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

### Define the version of Cogment protobuf API

The version of the cogment protobuf API is defined in the `config.json` file at the root of the repository. It should be defined as a URL pointing to a `.tar.gz` archive of the cogment api, e.g. `https://github.com/cogment/cogment/releases/download/v2.3.0/cogment-api.tar.gz`.

To use a local version of the API copy the files in `./cogment/api` and run `npm run build:protos:compile && npm run build:webpack && npm run build:tsc` instead of the default `npm run build`.

### Release process

People having maintainers rights of the repository can follow these steps to release a version **MAJOR.MINOR.PATCH**. The versioning scheme follows [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

1. Run `./scripts/create_release_branch.sh MAJOR.MINOR.PATCH` automatically compute and update the version of the package, create the release branch and update the changelog from the commit history,
2. On the release branch, check and update the changelog if needed, update internal dependencies, and make sure everything's fine on CI,
3. Run `./scripts/tag_release.sh MAJOR.MINOR.PATCH` to create the specific version section in the changelog, merge the release branch in `main`, create the release tag and update the `develop` branch with those.

The rest, publishing the packages to dockerhub and updating the mirror repositories, is handled directly by the CI.
