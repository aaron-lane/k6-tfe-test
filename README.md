# K6 TFE Test

This repository comprises an example of using [k6](https://k6.io/) to
test TFE.

The test script creates one workspace and one Terraform run per
iteration.

## Installation

Install k6 based on the
[k6 installation document](https://k6.io/docs/getting-started/installation).

## Usage

The URL and an administrative token for a TFE deployment are required
to run the test.

The following example demonstrates how to use the test script for a
smoke test:

```sh
k6 run \
  --env TFE_URL="https://tfe.example.com/" \
  --env TFE_API_TOKEN="abc123" \
  --env TFE_EMAIL="team-tf-onprem@hashicorp.com" \
  --env TFE_ORG_NAME="test" \
  --vus 1 \
  --iterations 1 \
  ./script.js
```

The number of virtual users (VUs), iterations, and duration can all be
adjusted via the k6 command-line interface.
