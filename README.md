# K6 TFE Test

This repository comprises an example of using [k6](https://k6.io/) to
test TFE.

## Installation

Install k6 based on the
[k6 installation document](https://k6.io/docs/getting-started/installation).

## Usage

The URL and an administrative token for a TFE deployment are required.

The following example demonstrates how to use the test script:

```sh
k6 run \
  -e TFE_URL="https://tfe.example.com/" \
  -e TFE_API_TOKEN="abc123" \
  -e TFE_EMAIL="team-tf-onprem@hashicorp.com" \
  -e TFE_ORG_NAME="test" \
  ./script.js
```
