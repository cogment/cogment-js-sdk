# Cogment JS SDK

- [SDK](./packages/%40cogment/cogment-js-sdk/README.md)
- [End to end tests](./packages/%40cogment/end-to-end-tests/README.md)

## Developers

### Basic setup

1. Install dependencies:

   ```shell script
   npm install
   ```

2. Build all the sub-packages:

   ```shell script
   npm run build --workspaces --if-present
   ```

3. Run all the tests:

   ```shell script
   npm run test --workspaces --if-present
   ```

### Define the version of Cogment protobuf API

The version of the cogment protobuf API is defined in the `./packages/@cogment/cogment-js-sdk/config.json` file at the root of the repository. It should be defined as a URL pointing to a `.tar.gz` archive of the cogment api, e.g. `https://github.com/cogment/cogment/releases/download/v2.3.0/cogment-api.tar.gz`.

To use a local version of the API copy the files in `./packages/@cogment/cogment-js-sdk/cogment/api` and run `npm run build:protos:compile && npm run build:webpack && npm run build:tsc` instead of the default `npm run build`.

### Release process

People having maintainers rights of the repository can follow these steps to release a version **MAJOR.MINOR.PATCH**. The versioning scheme follows [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

1. Run `./scripts/create_release_branch.sh MAJOR.MINOR.PATCH` automatically compute and update the version of the package, create the release branch and update the changelog from the commit history,
2. On the release branch, check and update the changelog if needed, update internal dependencies, and make sure everything's fine on CI,
3. Run `./scripts/tag_release.sh MAJOR.MINOR.PATCH` to create the specific version section in the changelog, merge the release branch in `main`, create the release tag and update the `develop` branch with those.

The rest, publishing the packages to dockerhub and updating the mirror repositories, is handled directly by the CI.
