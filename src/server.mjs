//
// Main Express server for nodejs-demoapp
// ---------------------------------------------
// UTE release-path adaptation: health/readiness, secure production sessions
// and proxy-aware cookie configuration.
//

import { readFileSync } from "fs";
import path from "path";
import express from "express";
import logger from "morgan";
import session from "express-session";
import { createClient as createRedisClient } from "redis";
import RedisStore from "connect-redis";
import { config as dotenvConfig } from "dotenv";
import appInsights from "applicationinsights";

import pageRoutes from "./routes/pages.mjs";
import apiRoutes from "./routes/api.mjs";
import authRoutes from "./routes/auth.mjs";
import todoRoutes from "./todo/routes.mjs";
import addMetrics from "./routes/metrics.mjs";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url)),
);
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3000);

console.log(`### 🚀 Node.js demo app v${packageJson.version} starting...`);

dotenvConfig();

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights
    .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setSendLiveMetrics(true)
    .setAutoCollectConsole(true, true)
    .start();

  console.log("### 🩺 Azure App Insights enabled");
}

const app = new express();
const readiness = {
  redis: process.env.REDIS_SESSION_HOST ? "starting" : "disabled",
};

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

// These probes are intentionally registered before optional session, auth or
// feature middleware. Liveness only proves the process is responsive; readiness
// also proves optional required dependencies are connected.
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok", version: packageJson.version });
});

app.get("/readyz", (_req, res) => {
  const ready = readiness.redis === "ready" || readiness.redis === "disabled";
  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not-ready",
    dependencies: readiness,
  });
});

app.set("views", [
  path.join(path.resolve(), "views"),
  path.join(path.resolve(), "todo"),
]);
app.set("view engine", "ejs");
app.use(express.static(path.join(path.resolve(), "public")));

const sessionSecret =
  process.env.SESSION_SECRET || (!isProduction ? packageJson.name : "");
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be injected for production runtime");
}

const sessionConfig = {
  secret: sessionSecret,
  cookie: {
    secure: process.env.SESSION_COOKIE_SECURE === "true",
    httpOnly: true,
    sameSite: "lax",
  },
  resave: false,
  saveUninitialized: false,
};

if (process.env.REDIS_SESSION_HOST) {
  const redisClient = createRedisClient({
    url: `redis://${process.env.REDIS_SESSION_HOST}`,
  });

  redisClient
    .connect()
    .then(() => {
      readiness.redis = "ready";
      console.log("### 📚 Session store configured using Redis");
    })
    .catch((err) => {
      readiness.redis = "failed";
      console.error("### 🚨 Redis session store error:", err.message);
      process.exit(1);
    });

  sessionConfig.store = new RedisStore({ client: redisClient });
} else {
  console.log("### 🎈 Session store not configured, sessions will not persist");
}

app.use(session(sessionConfig));

if (process.env.NODE_ENV !== "test") {
  app.use(
    logger("dev", {
      skip: (req) =>
        req.path.indexOf("/signin") === 0 ||
        req.path === "/healthz" ||
        req.path === "/readyz",
    }),
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.DISABLE_METRICS !== "true") {
  addMetrics(app);
}

app.use("/", pageRoutes);
app.use("/", apiRoutes);

if (process.env.ENTRA_APP_ID) {
  app.use("/", authRoutes);
}

if (process.env.TODO_MONGO_CONNSTR) {
  app.use("/", todoRoutes);
}

app.locals.version = packageJson.version;

app.use((req, _res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  if (req.method !== "GET") {
    err = new Error(`Method ${req.method} not allowed`);
    err.status = 500;
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  console.error(`### 💥 ERROR: ${err.message}`);

  if (appInsights.defaultClient) {
    appInsights.defaultClient.trackException({ exception: err });
  }

  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    message: err.message,
    error: err,
  });
});

app.listen(port);
console.log(`### 🌐 Server listening on port ${port}`);

export default app;
