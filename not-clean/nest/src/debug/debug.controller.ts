import { Controller, Get, StreamableFile } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import * as path from 'path';
import { DebugService } from './debug.service';

//
const base = 'src/debug/templates';
//
Handlebars.registerHelper('jsond', (context) => {
  return JSON.stringify(context, null, 2);
});

//

const debugSummaryItemTemplate = readFileSync(
  path.join(base, 'debug-summary-item.html.hbs'),
).toString();

Handlebars.registerPartial('debugSummaryItem', debugSummaryItemTemplate);

//

const debugSummaryTemplate = readFileSync(
  path.join(base, 'debug-summary.html.hbs'),
).toString();

const debugSummary = Handlebars.compile(debugSummaryTemplate);

//

@Controller('/debug')
export class DebugController {
  constructor(private debugService: DebugService) {}

  @Get('/')
  async streamAllLogs() {
    const stream = await this.debugService.streamJsonLogs();
    return new StreamableFile(stream, { disposition: 'inline' });
  }

  @Get('summary')
  async summary() {
    return debugSummary({
      logs: await this.debugService.getAllLogsArray(),
    });
  }
}
