import http from 'k6/http';
import { check, sleep } from 'k6';

// Advisory-only performance smoke test: exercises the same health/readiness
// surface the Jenkins release pipeline already checks functionally, but
// under light concurrent load. No thresholds are defined here on purpose --
// this stage never fails the build regardless of the numbers observed (see
// ute-workspace F021 spec.md Decision 4); the exported summary is for human
// review, not a pass/fail gate.
export const options = {
  vus: 5,
  duration: '20s',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const healthRes = http.get(`${BASE_URL}/healthz`);
  check(healthRes, { 'healthz status is 200': (r) => r.status === 200 });

  const readyRes = http.get(`${BASE_URL}/readyz`);
  check(readyRes, { 'readyz status is 200': (r) => r.status === 200 });

  const infoRes = http.get(`${BASE_URL}/info`);
  check(infoRes, { 'info status is 200': (r) => r.status === 200 });

  sleep(1);
}
