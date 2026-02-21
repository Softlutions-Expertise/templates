import { jitHandlebarsTemplate } from "../../../../utils/integrations/handlebars/jit-handlebars-template";

const html = `
  <div style="font-family: sans-serif; font-size: 12px; width: 100%; position: absolute; bottom: 30px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 0 30px 0 30px;">
  <span>
    Data de emissão: {{ request.emissionDate }} — Emitido por: {{ request.user.name }}
  </span>

  <span>
    Página <span class="pageNumber"></span> de <span class="totalPages"></span>.
  </span>
</div>
`;

export const hbTemplateSlotFooter = jitHandlebarsTemplate(html);
