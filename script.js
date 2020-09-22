import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import { check, sleep } from "k6";
import http from "k6/http";

const TERMINATED_RUN_STATUSES = [
  "applied",
  "canceled",
  "discarded",
  "errored",
  "forced_canceled",
];
const TF_CONFIG_ARCHIVE = open("./terraform.tar.gz", "b");
const TFE_API_URL = `${__ENV.TFE_URL}/api/v2`;
const TFE_EMAIL = __ENV.TFE_EMAIL;
const TFE_ORG_NAME = __ENV.TFE_ORG_NAME;
const TFE_URL = __ENV.TFE_URL;

export function setup() {
  let data = {
    params: {
      headers: {
        Authorization: `Bearer ${__ENV.TFE_API_TOKEN}`,
        "Content-Type": "application/vnd.api+json",
      },
    },
  };

  // https://www.terraform.io/docs/cloud/api/organizations.html#create-an-organization
  let createOrganizationBody = JSON.stringify({
    data: {
      type: "organizations",
      attributes: {
        name: TFE_ORG_NAME,
        email: TFE_EMAIL,
      },
    },
  });

  let createOrganization = http.post(
    `${TFE_API_URL}/organizations`,
    createOrganizationBody,
    data.params
  );

  if (createOrganization.status != "201") {
    throw new Error(
      `Failed to create the test organization ${TFE_ORG_NAME}: HTTP response status ${createOrganization.status}`
    );
  }

  data.organizationURL = `${TFE_URL}/${
    JSON.parse(createOrganization.body).data.links.self
  }`;

  sleep(1);

  return data;
}

export default (data) => {
  // https://www.terraform.io/docs/cloud/api/workspaces.html#create-a-workspace
  let workspaceName = `${__ITER}-${uuidv4()}`;

  let createWorkspaceBody = JSON.stringify({
    data: {
      type: "workspaces",
      attributes: {
        name: workspaceName,
        "auto-apply": true,
        "queue-all-runs": true,
        "terraform-version": "0.13.0",
      },
    },
  });

  let createWorkspace = http.post(
    `${data.organizationURL}/workspaces`,
    createWorkspaceBody,
    data.params
  );

  check(createWorkspace, {
    "workspace is created": (response) => response.status == "201",
  });

  let workspaceID = JSON.parse(createWorkspace.body).data.id;

  let workspaceURL = `${TFE_API_URL}/workspaces/${workspaceID}`;

  sleep(1);

  // https://www.terraform.io/docs/cloud/api/configuration-versions.html#create-a-configuration-version
  let createConfigurationVersionBody = JSON.stringify({
    data: {
      type: "configuration-versions",
      attributes: {
        "auto-queue-runs": false,
      },
    },
  });

  let createConfigurationVersion = http.post(
    `${workspaceURL}/configuration-versions`,
    createConfigurationVersionBody,
    data.params
  );

  check(createConfigurationVersion, {
    "configuration version is created": (response) => response.status == "201",
  });

  let configurationUploadData = JSON.parse(createConfigurationVersion.body)
    .data;

  let configurationUploadURL = configurationUploadData.attributes["upload-url"];

  let configurationVersionID = configurationUploadData.id;

  sleep(1);

  // https://www.terraform.io/docs/cloud/api/configuration-versions.html#upload-configuration-files
  let configurationArchive = http.file(TF_CONFIG_ARCHIVE);

  let uploadConfigurationFiles = http.put(
    configurationUploadURL,
    configurationArchive.data,
    data.params
  );

  check(uploadConfigurationFiles, {
    "configuration files uploaded": (response) => (response.status = "201"),
  });

  sleep(1);

  // https://www.terraform.io/docs/cloud/api/run.html#create-a-run
  let createRunBody = JSON.stringify({
    data: {
      type: "runs",
      relationships: {
        workspace: {
          data: {
            type: "workspaces",
            id: workspaceID,
          },
        },
        "configuration-version": {
          data: {
            type: "configuration-versions",
            id: configurationVersionID,
          },
        },
      },
    },
  });

  let createRun = http.post(`${TFE_API_URL}/runs`, createRunBody, data.params);

  check(createRun, {
    "run is created": (response) => (response.status = "201"),
  });

  let runID = JSON.parse(createRun.body).data.id;

  sleep(1);

  // https://www.terraform.io/docs/cloud/api/run.html#get-run-details
  let count = 0;
  let runStatus;

  while (count < 20) {
    let getRunDetails = http.get(`${TFE_API_URL}/runs/${runID}`, data.params);

    runStatus = JSON.parse(getRunDetails.body).data.attributes.status;

    if (TERMINATED_RUN_STATUSES.includes(runStatus)) {
      break;
    }

    sleep(5);

    count++;
  }

  check(runStatus, {
    "run is applied": (status) => status == "applied",
  });
};

export function teardown(data) {
  // https://www.terraform.io/docs/cloud/api/organizations.html#destroy-an-organization
  // k6 documentation says the body is optional, but omitting it causes the request to be unauthorized
  let destroyOrganization = http.del(data.organizationURL, "", data.params);

  if (destroyOrganization.status != "204") {
    throw new Error(
      `Failed to destroy the test organization ${TFE_ORG_NAME}: HTTP response status ${destroyOrganization.status}`
    );
  }
}
