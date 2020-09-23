# K6 TFE Test

This repository comprises an example of using [k6](https://k6.io/) to
test TFE.

The test workflow is to create one workspace and one Terraform run
based on the configuration in the [terraform directory](./terraform).

## Installation

Install k6 based on the
[k6 installation document](https://k6.io/docs/getting-started/installation).

Deploy TFE,
[install Terraform 0.13.3](https://www.terraform.io/docs/enterprise/admin/resources.html#managing-terraform-versions),
and
[create an API token](https://www.terraform.io/docs/cloud/users-teams-organizations/api-tokens.html).

## Usage

The following sections demonstrate how to perform different types of
testing. Each of the `*-test.js` scripts use the logic defined in
[test.js](./test.js) with different combinations of virtual users and
durations.

### Smoke Testing

```sh
k6 run \
  --env TFE_URL="https://tfe.example.com/" \
  --env TFE_API_TOKEN="abc123" \
  --env TFE_EMAIL="team-tf-onprem@hashicorp.com" \
  --env TFE_ORG_NAME="smoke-test" \
  ./smoke-test.js
```

### Load Testing

```sh
k6 run \
  --env TFE_URL="https://tfe.example.com/" \
  --env TFE_API_TOKEN="abc123" \
  --env TFE_EMAIL="team-tf-onprem@hashicorp.com" \
  --env TFE_ORG_NAME="load-test" \
  ./load-test.js
```

### Stress Testing

```sh
k6 run \
  --env TFE_URL="https://tfe.example.com/" \
  --env TFE_API_TOKEN="abc123" \
  --env TFE_EMAIL="team-tf-onprem@hashicorp.com" \
  --env TFE_ORG_NAME="stress-test" \
  ./stress-test.js
```

### Soak Testing

```sh
k6 run \
  --env TFE_URL="https://tfe.example.com/" \
  --env TFE_API_TOKEN="abc123" \
  --env TFE_EMAIL="team-tf-onprem@hashicorp.com" \
  --env TFE_ORG_NAME="soak-test" \
  ./soak-test.js
```
