// biome-ignore lint/correctness/noUnusedImports: This file is used by the jsreport module
import JsReport from "jsreport-core";

declare module "jsreport-core" {
  interface Configuration {
    parentModuleDirectory?: string;
  }
}
