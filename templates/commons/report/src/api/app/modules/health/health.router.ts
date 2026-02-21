import { type Request, type Response, Router } from "express";
import { appConfig } from "../../../../config";

export const createHealthRouter = async () => {
  const router = Router();

  router.get("/", (_: Request, res: Response) => {
    res.json({
      status: "up",
      build_time: appConfig.build.time,
      build_commit: appConfig.build.commit,
    });
  });

  return router;
};
