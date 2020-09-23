export { default, setup, teardown } from "./test.js";

export let options = {
  stages: [
    // below normal load
    { duration: "2m", target: 50 },
    { duration: "5m", target: 50 },
    // normal load
    { duration: "2m", target: 100 },
    { duration: "5m", target: 100 },
    // around the breaking point
    { duration: "2m", target: 150 },
    { duration: "5m", target: 150 },
    // beyond the breaking point
    { duration: "2m", target: 200 },
    { duration: "5m", target: 200 },
    // scale down. Recovery stage.
    { duration: "10m", target: 0 },
  ],
};
