import * as cheerio from "cheerio";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

const jsxRenderCore = (children: any) => {
  const sheet = new ServerStyleSheet();

  const jsx = sheet.collectStyles(children);

  const htmlComponent = renderToString(jsx);
  const htmlExtractedStyles = sheet.getStyleTags();

  return {
    htmlComponent,
    htmlExtractedStyles,
  };
};

export const jsxRenderReportHtml = (
  children: any,
  options: { mode: "document" | "fragment" },
) => {
  const { htmlComponent, htmlExtractedStyles } = jsxRenderCore(children);

  switch (options.mode) {
    case "document": {
      const $ = cheerio.load(htmlComponent, {}, true);
      $("html head").append(htmlExtractedStyles);
      return $.html();
    }

    case "fragment": {
      const $ = cheerio.load(htmlComponent, {}, false);
      return `${$.html()}${htmlExtractedStyles}`;
    }
  }
};

export const jsxRenderReportHtmlFragment = (children: any) => {
  return jsxRenderReportHtml(children, { mode: "fragment" });
};

export const jsxRenderReportHtmlDocument = (children: any) => {
  return jsxRenderReportHtml(children, { mode: "document" });
};
