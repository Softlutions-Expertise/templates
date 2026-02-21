import { appConfig } from "../config";

export enum AppAsset {
  CSS_RESET = "css/reset.css",

  IMAGES_BANDEIRA_RO = "images/bandeira-ro.png",
}

export const appStaticUrl = (assetPath: AppAsset | string) => {
  return `http://localhost:${appConfig.port}/static/${assetPath}`;
};
