import pluginChromePdf from "jsreport-chrome-pdf";
import jsreport from "jsreport-core";
import pluginHandlebars from "jsreport-handlebars";
import { messageStandards } from "../../../messages";
import { APP_PATH_REPO_SRC } from "../../app-paths";
import { withJitCache } from "../../jit-cache";
import { logger } from "../../logger";

export const createJsReportInstance = async () => {
  const jsReportInstance = jsreport({
    parentModuleDirectory: APP_PATH_REPO_SRC,
  });

  jsReportInstance.use(pluginHandlebars());
  
  
  const env: Record<string, string> = {};
  const userDataDir = process.env.CHROME_DATA_DIR;

  if(userDataDir) {
    env.XDG_CONFIG_HOME = userDataDir;
    env.XDG_CACHE_HOME = userDataDir;
  }

  jsReportInstance.use(
    pluginChromePdf({
      launchOptions: {
        headless: true,
        args: ["--no-sandbox", "--no-gpu", "--disable-crash-reporter", "--no-crashpad"],
        userDataDir: userDataDir,
        env: {
          ...env,
        }
      },
    }),
  );

  try {
    await jsReportInstance.init();
    logger.debug(messageStandards.infrastructure.jsReport.init.success());
  } catch (err) {
    logger.error(messageStandards.infrastructure.jsReport.init.error(err));
    process.exit(1);
  }

  return jsReportInstance;
};

export const getJsReportInstance = withJitCache(createJsReportInstance);
