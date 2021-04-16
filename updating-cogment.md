# Updating Cogment

The Cogment framework is composed of several components, each of which
[cogment-js-sdk] must maintain compatibility against. The integration
test suite runs a full trial using an embedded
[Cogment application](/__tests__/end-to-end/cogment-app). This embedded
application tracks the version of each component [cogment-js-sdk] works
against.

Components [cogment-js-sdk] maintains compatibility with, and the
location of their versions in this repository are the following:

- [cogment-api]
  - [.cogment-apirc.yaml](/.cogment-apirc.yaml)
- [cogment-cli]
  - [.cogment-clirc.yaml](/.cogment-clirc.yaml)
- [cogment-orchestrator]
  - [orchestrator.dockerfile](/__tests__/end-to-end/cogment-app/orchestrator.dockerfile)
- [cogment-py-sdk]
  - [client/requirements.txt](/__tests__/end-to-end/cogment-app/client/requirements.txt)
  - [configurator/requirements.txt](/__tests__/end-to-end/cogment-app/configurator/requirements.txt)
  - [echo/requirements.txt](/__tests__/end-to-end/cogment-app/echo/requirements.txt)
  - [environment/requirements.txt](/__tests__/end-to-end/cogment-app/environment/requirements.txt)

[cogment-api]: https://github.com/cogment/cogment-api
[cogment-cli]: https://github.com/cogment/cogment-cli
[cogment-js-sdk]: https://github.com/cogment/cogment-js-sdk
[cogment-orchestrator]: https://github.com/cogment/cogment-orchestrator
[cogment-py-sdk]: https://github.com/cogment/cogment-py-sdk
