[![build-test](https://github.com/owkin/docker-dependency-updater/actions/workflows/test.yml/badge.svg?branch=main&style=flat-square)](https://github.com/owkin/docker-dependency-updater/actions/workflows/test.yml)

## About

GitHub action to update system dependencies installed in a Dockerfile.
This action currently supports apk and apt based images.

## Usage

In the examples below we are also using other actions:
 - [`peter-evans/create-pull-request`](https://github.com/peter-evans/create-pull-request) action will create a pull request on the repository if the files are changed in the action context.
 - [`actions/checkout`](https://github.com/actions/checkout/) to checkout the repository content.

### Update dependencies

Using this you can automatically update dependencies of your docker images in a similar way as using dependabot.

```yaml
name: Dependencies
on:
  schedule:
    - cron: "0 6 * * *"
  workflow_dispatch:

jobs:
  updates:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: owkin/docker-dependency-updater@v2
        with:
          dockerfile: ./docker/Dockerfile
          dependencies: ./docker/dependencies.json
          apply: true

      - uses: peter-evans/create-pull-request@v3
        with:
          commit-message: "chore(deps): update dockerfile dependencies"
          branch: chore/update-docker-dependencies
          title: "chore(deps): update dockerfile dependencies"
          body: Updated dependencies.json
          labels: dependencies
          delete-branch: true
```

Note the `workflow_dispatch` trigger that will enable you to run this workflow if the daily update missed the new version and you need to update during the day.

## Customizing

### Action inputs

| Name           | Type   | Description |
| ---            | ---    | ---         |
| `dockerfile`   | String | Path to the Dockerfile you want to update |
| `dependencies` | String | Path to the dependencies.json file where you keep your dependencies pinned |
| `apply`        | Bool   | If true the action will apply changes directly to the files checked out |

## Recommendations

Before using this Action you will need to update your Dockerfile in order to extract the dependencies you install.
The `dependencies.json` file should have the following structure:
```json
[
  {
    "name": "curl",
    "version": "7.55.0-r2"
  }
]
```

In your Dockerfiles you can install the dependencies from this file by copying it inside the image and running the update taking this file as an input.

```docker
FROM alpine/latest

COPY ./dependencies.json /tmp/dependencies.json

RUN apk update && apk add --no-cache jq \
        && jq -r '.[] | "\(.name)=\(.version)"' /tmp/dependencies.json | xargs apk add --no-cache \
        && rm /tmp/dependencies.json
```

One of the downsides is that you have the `jq` package installed in an unpinned manner but since it's only a build dependency, it should be acceptable.


