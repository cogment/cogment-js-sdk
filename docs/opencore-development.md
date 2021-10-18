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

Caveats:

When a release is ready to be made, there are a few rules of thumb:

- The `next` branch will generate releases on the `next` channel. This
  should be reserved primarily for breaking changes / major releases
  that are ready for public consumption but are still not the "latest"
  version.
- The `main` branch will generate releases on the `latest` channel. All
  non-breaking-change type commits should land here.
- The `alpha` branch will generate prerelease releases on the alpha
  channel. The release will be a version bump along with an `-alpha1`
  suffix. Each addition to this branch will increment the suffix by one.
  If the release is a breaking change, this branch could be used to
  merge `next`. Alternatively, this branch could be merged into `main`.
  This depends on the nature of the changes made in the `alpha` release.
  It may be desirable to merge into both `next` and `main` if merging a
  `fix` commit while there is ongoing work in the `next` branch.

[semver.org]: https://semver.org
