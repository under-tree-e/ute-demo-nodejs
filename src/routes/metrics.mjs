//
// Adds Prometheus metrics to the /metrics endpoint
// NOTE: Works a little differently to the other routes
//

import { createHash, timingSafeEqual } from "node:crypto";
import PromMiddleware from "express-prometheus-middleware";

const METRICS_PATH = "/metrics";

// SHA-256 digest of a byte buffer, gives fixed-length input for timingSafeEqual
function digest(bytes) {
  return createHash("sha256").update(bytes).digest();
}

// Returns middleware that answers 401 unless the Authorization header is exactly `Bearer <token>`
// Node decodes header bytes as latin1, so the header is re-encoded as latin1 to recover the raw bytes
function requireBearerToken(token) {
  const expected = digest(Buffer.from(`Bearer ${token}`, "utf8"));

  return (req, res, next) => {
    const actual = digest(
      Buffer.from(req.get("authorization") ?? "", "latin1"),
    );
    if (timingSafeEqual(actual, expected)) {
      return next();
    }

    res.set("WWW-Authenticate", "Bearer");
    res.status(401).send("Unauthorized");
  };
}

// Add metrics to the app
// When METRICS_TOKEN is set and non-empty, scrapes must send `Authorization: Bearer <METRICS_TOKEN>`
// We can't use app.use() here due to how the metrics middleware wants to be registered
export default function addMetrics(app) {
  const token = process.env.METRICS_TOKEN;
  if (token) {
    app.get(METRICS_PATH, requireBearerToken(token));
  }

  app.use(
    PromMiddleware({
      metricsPath: METRICS_PATH,

      // Standard NodeJS runtime metrics
      collectDefaultMetrics: true,

      // HTTP request metrics
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    }),
  );
}
