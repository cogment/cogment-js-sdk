# Open Core Development

The `origin` for this repository is hosted on gitlab.com - when updated,
the `main` branch is released downstream to Github, where public
development and community management occurs.

Open source contributions that land on the public facing github
repository will be merged back upstream to the private codebase.

## Private Registry

This project publishes to a private registry scoped under the name
`@ai-r`. If you wish to install from this private registry, you can
instruct npm to install all `@ai-r` scoped packages to use the private
registry by updating the project's .npmrc:

[Authenticate to the package registry](https://docs.gitlab.com/ee/user/packages/npm_registry/)
by:

1. Generating a
   [personal access token](https://docs.gitlab.com/ee/user/packages/npm_registry/#authenticate-to-the-package-registry)
2. Authenticate to the project level npm registry:

```shell script
npm config set @ai-r:registry=https://gitlab.com/api/v4/projects/22532182/packages/npm/
npm config set '//gitlab.example.com/api/v4/projects/22532182/packages/npm/:_authToken' "<your token>"
```
