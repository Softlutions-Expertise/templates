import styled from "styled-components";
import { AppAsset, appStaticUrl } from "../../../../../static/app-static";

type IStyledHtmlProps = {
  $orientation?: "landscape" | "portrait";
};

const StyledHtml = styled.html<IStyledHtmlProps>`
  @page {
    size: A4 ${({ $orientation }) => $orientation ?? "portrait"};
    margin: 40px 30px 50px 30px;
  }

  body {
    font-family: sans-serif;
    font-size: 11px;
  }
`;

export const JsxReportLayout = (
  props: { title?: string; children: any } & IStyledHtmlProps
) => {
  const styledHtmlProps = {
    $orientation: props.$orientation,
  };

  return (
    <StyledHtml {...styledHtmlProps} lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{props.title ?? "Relatório"}</title>

        <link rel="stylesheet" href={appStaticUrl(AppAsset.CSS_RESET)} />
      </head>

      <body aria-hidden="true">{props.children}</body>
    </StyledHtml>
  );
};
