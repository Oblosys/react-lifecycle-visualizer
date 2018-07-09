#!/usr/bin/env bash

# Bump patch version in package.json & examples/parent-child-demo/package.json, commit as "Release X.Y.Z",
# and add git tag "vX.Y.Z" with message "Release X.Y.Z".

set -o nounset -o errexit -o pipefail
gitStatus=$(git status -s)
if [[ -n $gitStatus ]]; then
echo "ERROR: Working tree has modified/untracked files:"
echo "${gitStatus}"
exit 1
fi

if [[ `cat package.json` =~ .*\"version\":\ *\"([0-9]+)\.([0-9]+)\.([0-9]+)\" ]]
then
  vMajor=${BASH_REMATCH[1]}
  vMinor=${BASH_REMATCH[2]}
  vPatch=${BASH_REMATCH[3]}
  newVersion=$vMajor.$vMinor.$(( $vPatch + 1 ))
  echo "Bumped version from ${vMajor}.${vMinor}.${vPatch} to ${newVersion}"
  sed -i '' -e "s/\(\"version\": *\"\).*\(\".*\)$/\1${newVersion}\2/" package.json
  sed -i '' -e "s/\(\"react-lifecycle-visualizer\": *\"[\^~]\{0,1\}\).*\(\".*\)$/\1${newVersion}\2/" examples/parent-child-demo/package.json
  git add package.json examples/parent-child-demo/package.json
  git commit -m "Release ${newVersion}"
  git tag -a "v${newVersion}" -m "Release ${newVersion}"
else
  echo "ERROR: No \"version\" found in package.json"
  exit 1
fi
