export { default, setup, teardown } from "./test.js";

export let options = {
  stages: [
    // ramp up to 80 users
    { duration: "2m", target: 80 },
    // stay at 80 for ~4 hours
    { duration: "3h56m", target: 80 },
    // scale down
    { duration: "2m", target: 0 },
  ],
};
