import * as cheerio from "cheerio";
import { renderToString } from "react-dom/server";

// ----------------------------------------------------------------------

const jsxRenderCore = (children: any) => {
  const htmlComponent = renderToString(children);

  return {
    htmlComponent,
  };
};

// ----------------------------------------------------------------------

export const jsxRenderReportHtml = (
  children: any,
  options: { mode: "document" | "fragment" },
) => {
  const { htmlComponent } = jsxRenderCore(children);

  switch (options.mode) {
    case "document": {
      const $ = cheerio.load(htmlComponent, {}, true);
      return $.html();
    }

    case "fragment": {
      const $ = cheerio.load(htmlComponent, {}, false);
      return $.html();
    }
  }
};

// ----------------------------------------------------------------------

export const jsxRenderReportHtmlFragment = (children: any) => {
  return jsxRenderReportHtml(children, { mode: "fragment" });
};

// ----------------------------------------------------------------------

export const jsxRenderReportHtmlDocument = (children: any) => {
  return jsxRenderReportHtml(children, { mode: "document" });
};
