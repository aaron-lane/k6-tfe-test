export { default, setup, teardown } from "./test.js";

export let options = {
  // 1 virtual user
  vus: 1,
  // 1 minute
  duration: "1m",
  // 95% of requests must complete below 0.280s
  thresholds: { http_req_duration: ["p(95)<280"] },
};
