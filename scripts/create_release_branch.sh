#!/usr/bin/env bash

####
# Release preparation script
#
# Should be executed by the release manager to initiate the finalization work on a particular release
####

# shellcheck disable=SC1091
source "$(dirname "${BASH_SOURCE[0]}")/commons.sh"

function usage() {
  local usage_str=""
  usage_str+="Update the version and create a release branch\n\n"
  usage_str+="Usage:\n"
  usage_str+="  $(basename "${BASH_SOURCE[0]}") [--dry-run]\n\n"
  usage_str+="Options:\n"
  usage_str+="  --dry-run:                              Do not push anything to the remote.\n"
  usage_str+="  -h, --help:                             Show this screen.\n"
  printf "%b" "${usage_str}"
}

set -o errexit

# Parse the command line arguments.
dry_run=0

while [[ "$1" != "" ]]; do
  case $1 in
    --dry-run)
      dry_run=1
      ;;
    --help | -h)
      usage
      exit 0
      ;;
    *)
      printf "%s: unrecognized argument.\n\n" "$1"
      usage
      exit 1
      ;;
  esac
  shift
done

printf "* Preparing a new release...\n"

# Move to the remote `develop` branch
git -C "${ROOT_DIR}" fetch -q "${GIT_REMOTE}"
git -C "${ROOT_DIR}" checkout -q "${GIT_REMOTE}/develop"

# Install the dependencies
cd "${ROOT_DIR}" && npm ci

printf "** Now on the latest %s/develop\n" "${GIT_REMOTE}"

# Retrieving the current version of the package
current_version=$(retrieve_package_version)

printf "** Current version is v%s\n" "${current_version}"

# Running `standard-version` to update the changelog and compute the new version
cd "${ROOT_DIR}" && HUSKY=0 npx standard-version

# Retrieve this new version
updated_version=$(retrieve_package_version)
printf "** Version updated to v%s\n" "${updated_version}"

# Creating the release branch, this will fail if the branch already exists
release_branch="release/v${updated_version}"
git -C "${ROOT_DIR}" branch "${release_branch}"
git -C "${ROOT_DIR}" checkout -q "${release_branch}"

printf "** Release branch \"%s\" created\n" "${release_branch}"

if [[ "${dry_run}" == 1 ]]; then
  printf "** DRY RUN SUCCESSFUL - Nothing pushed to %s\n" "${GIT_REMOTE}"
else
  git -C "${ROOT_DIR}" push -q "${GIT_REMOTE}" "${release_branch}"
  printf "** Release branch \"%s\" pushed to \"%s\" \n" "${release_branch}" "${GIT_REMOTE}"
fi

printf "* To finalize the release:\n"
printf "** Update the dependencies, in particular make sure nothing is relying on a \"latest\" version of another package.\n"
printf "** Check and update the package's changelog at \"%s/CHANGELOG.md\"\n" "${ROOT_DIR}"
printf "** Make sure the CI builds everything properly\n"
printf "** Finally, run \"%s %s\"\n" "$(dirname "${BASH_SOURCE[0]}")/tag_release.sh" "${updated_version}"
