# Contributing

<!-- prettier-ignore-start -->
[TOC]: #

## Table of Contents
- [Contributing](#contributing)
  - [Getting Started](#getting-started)
    - [CLA](#cla)
    - [Guidelines](#guidelines)
      - [Support questions](#support-questions)
      - [Contributions](#contributions)
  - [Ground Rules](#ground-rules)
    - [Responsibilities](#responsibilities)
    - [Your First Contribution](#your-first-contribution)
    - [Coding guidelines](#coding-guidelines)
    - [Commit conventions](#commit-conventions)
  - [How to report a bug](#how-to-report-a-bug)
    - [Security disclosures](#security-disclosures)
    - [Filing a bug report](#filing-a-bug-report)
  - [Code review process](#code-review-process)
  - [Community](#community)

<!-- prettier-ignore-end -->

## Getting Started

You are here to help on [@cogment/cogment-js-sdk][cogment-js-sdk-npm]?
Awesome, feel welcome and read the following sections in order to know
how to ask questions and how to work on something.

Before you begin:

- Have you read the [code-of-conduct]?
- [Cogment Documentation][cogment-doc]
- [Project's WiKi Pages][cogment-js-sdk-wiki]

### Guidelines

#### Support questions

Please, don't use the issue tracker for
[support questions](/CONTRIBUTING.md#support-questions).

Please search through the following before opening any new issue or
asking a question:

- [Cogment documentation][cogment-doc]
- [List of all existing issues][cogment-js-sdk-issues]
- [Questions on StackOverflow][stackoverflow]

#### Contributions

[cogment-js-sdk] is an open source project and we love to
receive contributions from our community — you! There are many ways to
contribute, from writing tutorials or blog posts, improving the
documentation, submitting bug reports and feature requests or writing
code which can be incorporated into [cogment-js-sdk] itself.

## Ground Rules

### Responsibilities

- Read and follow our [coding guidelines][codeguidelines]
- Ensure that code that goes into core meets all requirements in [the
  pull request template][pr-template]
- Create issues for any major changes and enhancements that you wish to
  make. Discuss things transparently and get community feedback.
- Keep feature versions as small as possible, preferably one new feature
  per version.

### Your First Contribution

- Unsure where to begin contributing? You can start by looking
  through these beginner and help-wanted issues:
- Beginner issues - issues which should only require a few lines of
  code, and a test or two.
- Help wanted issues - issues which should be a bit more involved than
  beginner issues. Both issue lists are sorted by total number of
  comments. While not perfect, number of comments is a reasonable proxy
  for impact a given change will have.

1.  Create your own fork of the code
2.  Do the changes in your fork
3.  If you like the change and think the project could use it, create a
    pull request to the [github repository][cogment-js-sdk]

### Coding guidelines

Make sure to read the [coding guidelines][codeguidelines]!

### Commit conventions

This repository uses [commitizen] style commit messages to automate
several processes.

## How to report a bug

### Security disclosures

If you find a security vulnerability, do NOT open an issue. Any security
issues should be submitted directly to dev+security@ai-r.com. In order
to determine whether you are dealing with a security issue, ask yourself
these two questions:

- Can I access something that's not mine, or something I shouldn't have
  access to?
- Can I disable something for other people?

If the answer to either of those two questions are "yes", then you're
probably dealing with a security issue. Note that even if you answer
"no" to both questions, you may still be dealing with a security issue,
so if you're unsure, just email us at dev+security@ai-r.com.

### Filing a bug report

You can even include a template so people can just copy-paste (again, less work for you).

When filing an issue, make sure to answer these five questions:

1. What version of cogment are you using (`cogment version`)?
2. What operating system and processor architecture are you using?
3. What did you do?
4. What did you expect to see?
5. What did you see instead?

General questions should go to the [cogment][cogment-discord] discord
instead of the issue tracker. The AIRFolk there will answer or ask you
to file an issue if you've tripped over a bug.

## Code review process

The core team looks at Pull Requests on a regular basis in a weekly
triage meeting that we hold in a public Google Hangout. The hangout is
announced in the weekly status updates that are sent to the puppet-dev
list. Notes are posted to the Puppet Community community-triage repo and
include a link to a YouTube recording of the hangout.

After feedback has been given we expect responses within two weeks.
After two weeks we may close the pull request if it isn't showing any
activity.

## Community

Please see the [cogment][cogment-doc] documentation on ["Community
Channels"][cogment-doc-community-channels].

[code-of-conduct]: /CODE_OF_CONDUCT.md
[codeguidelines]: /docs/codeguidelines.md
[cogment-discord]: https://discord.gg/55h7fnqdSJ
[cogment-doc-community-channels]: https://ai-r.gitlab.io/cogment-doc/support/community-channels/
[cogment-doc]: https://ai-r.gitlab.io/cogment-doc
[cogment-js-sdk-issues]: https://github.com/cogment/cogment-js-sdk/issues?q=is%3Aissue+is%3Aclosed
[cogment-js-sdk-npm]: https://npmjs.com/@cogment/cogment-js-sdk
[cogment-js-sdk-wiki]: https://github.com/cogment/cogment-js-sdk/wiki
[cogment-js-sdk]: https://github.com/cogment/cogment-js-sdk
[commitizen]: https://commitizen-tools.github.io/commitizen/
[pr-template]: /.github/PULL_REQUEST_TEMPLATE.md
[stackoverflow]: https://stackoverflow.com/questions/tagged/cogment-js-sdk
