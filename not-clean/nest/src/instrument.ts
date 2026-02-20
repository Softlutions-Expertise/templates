// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    environment: process.env.SENTRY_ENVIRONMENT,

    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
  });
}
