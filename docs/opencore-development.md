# Open Core Development

The `origin` for this repository is hosted on gitlab.com - when updated,
the `main` branch is released downstream to Github, where public
development and community contributions occur.

Open source contributions that land on the public facing github
repository will be merged back upstream to the private codebase.

## Release Process

This repository follows [semantic versioning][semver.org]

A general proposed workflow is:

The `develop` branch acts as the default branch for the repository. All
merge requests will target this branch by default. No releases are
generated from this branch, it can be used to stage commits while
preparing a release.

A release originates from the creation of a new tag on the `origin`
repository. This tag is used as a reference to generate "releases" of
build artifacts of a single commit from the CI process. These "releases"
are sent to multiple targets: gitlab (`origin`) releases, github
(`downstream`) releases, npm, gitlab's private registry, etc.

[semver.org]: https://semver.org
