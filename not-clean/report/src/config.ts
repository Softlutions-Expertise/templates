import { parseValidDate } from "./utils/parse";
import { sealConfig } from "./utils/secrets";

export const appConfig = {
  prefferedGroups: {
    injectEntryDate: true,
  },

  build: {
    commit: process.env.BUILD_COMMIT ?? "live",
    time: (parseValidDate(process.env.BUILD_TIME) ?? new Date()).toISOString(),
  },

  port: process.env.PORT || 3003,

  logger: {
    enabled: process.env.NO_LOG !== "true",
  },

  minio: {
    connection: {
      endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === "true",

      accessKey: sealConfig(process.env.MINIO_ACCESS_KEY ?? "minioaccess"),
      secretKey: sealConfig(process.env.MINIO_SECRET_KEY ?? "miniosecret"),
    },

    modules: {
      pdfs: {
        expirationViewUrl: 24 * 60 * 60,
        bucketName: process.env.MINIO_BUCKET ?? "central-vagas-dev",
      },
    },
  },
};
