<!--
Implementation issues are used break-up a large piece of work into small, discrete tasks that can
move independently through the build workflow steps. They're typically used to populate a Feature
Epic. Once created, an implementation issue is usually refined in order to populate and review the
implementation plan and weight.
Example workflow: https://about.gitlab.com/handbook/engineering/development/threat-management/planning/diagram.html#plan
-->

## Why are we doing this work

<!--
A brief explanation of the why, not the what or how. Assume the reader doesn't know the
background and won't have time to dig-up information from comment threads.
-->

The [cogment-api repo][1] contain the protobuf definitions that define the cogment API. These need to be embedded in the js-sdk in some fashion during both local development as well as when packaging the project.

## Relevant links

<!--
Information that the developer might need to refer to when implementing the issue.
-->

- [Implementation Proposal][2]
- [cogment-api repo][1]
- [npm bundledDependencies](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#bundleddependencies)
- [npm dependencies](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#dependencies)

## Non-functional requirements

<!--
Add details for required items and delete others.
-->

- [ ] Documentation:
- [ ] Feature flag:
- [ ] Performance:
- [ ] Testing:

## Implementation plan

<!--
Steps and the parts of the code that will need to get updated. The plan can also
call-out responsibilities for other team members or teams.
-->

Implementation ideas:

### Convert [cogment-api][1] to SDK monorepo

Currently, the [cogment-api][1] repo contains our protobuf definitions. It would make sense to package each SDK implementation as a subdirectory of [cogment-api][1], and have a single build process transpile protobufs for each language. The actual SDK code could live in this repository as well.

Note: this monorepo would _not_ be a reproduction of the pre-1.0 monorepo - the repo would contain only the protobuf definitions and potentially the SDK code.
Note: The proto files themselves do not have to be included in compiled packages, although they _could_, this would allow developers who want more fine grained control over consumption of the protobuf api.
Note: Exporting the *public* portion of the compiled protobufs would allow developers to skip use of the SDK altogether, using the compiled protobuf code.

Advantages:

- Protobuf compilation would happen in a single place, the [cogment-api][1] repository, instead of each project implementing a custom process for embedding protobuf files and the compiling them.
- Versioning of SDKs to the API is dealt with. Because SDK code lives alongside protobuf code, there is no need for manually matching a tarball version against your SDK version
-

### CommonJS package

Add a package.json to [cogment-api][1] and include [cogment-api][1] as a dependency of this project using either git+ssh or a tarball dependency.

### Custom script

Implement code for downloading the correct [cogment-api][1] version. The script would need to handle local development as well as packaging.

/milestone %"cogment-js-sdk-1.0"
/assign @air-emma
/epic &4

[1]: https://gitlab.com/ai-r/cogment-api
[2]: #2
