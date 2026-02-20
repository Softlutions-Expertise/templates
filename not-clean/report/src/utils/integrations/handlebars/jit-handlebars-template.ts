import { compile } from "handlebars";
import type { MaybePromise } from "p-map";
import { withJitCache } from "../../jit-cache";

export const jitHandlebarsTemplate = (
  htmlSource: string | (() => MaybePromise<string>),
) => {
  return withJitCache(async () => {
    let html: string;

    if (typeof htmlSource === "string") {
      html = htmlSource;
    } else {
      html = await htmlSource();
    }

    return compile(html);
  });
};
