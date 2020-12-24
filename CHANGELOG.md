## [1.3.2](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.3.1...v1.3.2) (2020-12-24)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([ab78a0a](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/ab78a0aee3a9738bfba783a2ba6a8d2bfaf0213d))

## [1.3.1](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.3.0...v1.3.1) (2020-12-18)


### Bug Fixes

* **ci:** unable to depend on jobs from the same stage ([7da754a](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/7da754aaaa9a2afa9ea94fee479f576c8da34e9b))

# [1.3.0](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.2.1...v1.3.0) (2020-12-18)

### Bug Fixes

- **lint-staged:** arguments were not being passed to jest through npm run test ([a32d360](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/a32d360cdb99845c91f162d86a2caf89b02381c3))
- **lint-staged:** fix .ts hook pattern to properly exclude .d.ts files ([d7ed999](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/d7ed999f3ace26e94baa7cb1dc6c56906a00caaa))

### Features

- **websocket:** we have a working websocket streaming eventLoop! ([38228ca](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/38228caaed9d0b68186f0321b406de8d516b2f7e)), closes [#16](https://gitlab.com/ai-r/cogment-js-sdk-1.0/issues/16)
- **websocket:** wip implement websocket transport ([d7344d0](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/d7344d0098bc3360b7bf0fa33486bd2395d7dba5))

## [1.2.1](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.2.0...v1.2.1) (2020-12-14)

### Bug Fixes

- **dockerfile:** use more secure base image as per Snyk ([5d6d180](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/5d6d180cbd35518bded55f595bc00c45bbd808bf))

### Reverts

- **dockerfile:** revert to less secure image for now ([ae389b6](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/ae389b6006e8752946244a9afde6c7f7cc9b533a))

# [1.2.0](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.1.0...v1.2.0) (2020-12-14)

### Bug Fixes

- **build:** reduce bundle size by not importing cosmiconfig in the main path ([65fbcdf](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/65fbcdf434e03f892b50d722a037d54810619316))
- **gitlab-ci:** fix docker-compose logs syntax ([da469dc](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/da469dc1b4707de5b210850eca4fc2928f48fe4c))

### Features

- **actorsession:** first pass on event loop logic ([4188480](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/41884806ed109d21af956189eea0bfd71c01a429))
- **config:** implement simple config module ([db8844e](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/db8844e175879ee1aac38cb6f13dea7d2a44e33b))
- **logger:** add support for log level ([edf7eb4](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/edf7eb42fbc470587b0551c17fc189fbb92877e8))
- **trialcontroller:** implement getTrialInfo, fix terminateTrial ([b0802b3](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/b0802b3a2ab275c23f8a5a1556eebdd2315da9ca))

# [1.1.0](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.0.3...v1.1.0) (2020-12-12)

### Bug Fixes

- **tests:** ignore .d.ts files in test commit hook ([299ee93](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/299ee93bd3c65a9100acc39b090f0e2fe4806103))

### Features

- **implementation:** scaffold out more functions, prepare to connect ([14b573e](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/14b573e82088ec0fe4b3e090fd97814169822aa0))

## [1.0.3](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.0.2...v1.0.3) (2020-12-11)

### Bug Fixes

- **ci:** need git for semantic-release ([30ed5e3](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/30ed5e3cb3a4ca59269954eb46b7cc3ccc5e1912))
- **dockerfile:** boo alpine and your weird non-gcc compiler ([256fa34](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/256fa3412bae87736278a5b84ad6c3a323920524))
- **dockerfile:** node:14-alpine does not include curl ([4377519](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/43775195ac3c24744d040b6247fa1c9bdaa887a1))
- **package.json:** small package.json fixes ([4b7118b](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/4b7118b4375ce572fa94d076095f72953952478d))
- **release:** node:14-alpine comes with no git ([7f2a824](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/7f2a82438c70551355c4a0b318dc6650239d96ec))

### Reverts

- **dockerfile:** use non-alpine inside docker ([054d07d](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/054d07d1554986a99679bdd9576b6e44d3605d8c))

## [1.0.2](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.0.1...v1.0.2) (2020-12-11)

### Bug Fixes

- **semantic-release:** disable assets for gitlab release for now ([4b3071c](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/4b3071ce85d7b27e973ebf3298c56c7b838f9930))

## [1.0.1](https://gitlab.com/ai-r/cogment-js-sdk-1.0/compare/v1.0.0...v1.0.1) (2020-12-11)

### Bug Fixes

- **ci:** use https for repository url ([d536d11](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/d536d11355b6787de98583a01fedbd8b26ed3470))

### Reverts

- **ci:** keep using the git protocol for repository ([59c32fb](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/59c32fbc5b949b0439b8731b9d57896968d1fd2a))

# 1.0.0 (2020-12-11)

### Bug Fixes

- **tooling:** fix repository url ([f90236b](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/f90236bee379fe51682b95227fa7fdbcb5f0b050))

# 1.0.0 (2020-12-11)

### Bug Fixes

- **tooling:** fix repository url ([f90236b](https://gitlab.com/ai-r/cogment-js-sdk-1.0/commit/f90236bee379fe51682b95227fa7fdbcb5f0b050))
