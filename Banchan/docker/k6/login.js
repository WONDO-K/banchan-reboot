import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    baseline: {
      executor: "constant-vus",
      vus: 10,
      duration: "2m",
    },
    ramp: {
      executor: "ramping-vus",
      stages: [
        { duration: "30s", target: 10 },
        { duration: "1m", target: 50 },
        { duration: "30s", target: 0 },
      ],
    },
    spike: {
      executor: "ramping-vus",
      stages: [
        { duration: "10s", target: 0 },
        { duration: "20s", target: 100 },
        { duration: "10s", target: 0 },
      ],
    },
  },
};

const BASE_URL = "http://host.docker.internal:8080";

export default function () {
  const url = `${BASE_URL}/api/auth/origin/login`;
  const payload = JSON.stringify({
    userId: "test-user",
    passwordHash: "test1234!",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);
  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
