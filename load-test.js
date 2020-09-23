export { default, setup, teardown } from "./test.js";

export let options = {
  stages: [
    // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: "5m", target: 100 },
    // stay at 100 users for 10 minutes
    { duration: "10m", target: 100 },
    // ramp-down to 0 users over 5 minutes
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    // 95% of requests must complete below 0.280s
    http_req_duration: ["p(95)<280"],
  },
};
