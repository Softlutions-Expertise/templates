import * as cheerio from 'cheerio';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import { IHoliday } from '../../interfaces/IHoliday';
import { IHolidayExtractorService } from '../../interfaces/IHolidaysExtractorService';
import { FeriadosComBrDependencies as IFeriadosComBrDependencies } from './interfaces/di';

export class FeriadosComBrService implements IHolidayExtractorService {
  #queue = new PQueue({ concurrency: 1, interval: 5000 });

  constructor(private feriadosDependencies: IFeriadosComBrDependencies) {}

  async getInternalStateOptions(stateUf: string) {
    const response = await fetch('https://www.feriados.com.br/cidades.php', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `estado=${stateUf.toUpperCase()}`,
      method: 'POST',
    });

    const html = await response.text();

    const $ = cheerio.load(html, null, false);

    const { extractedOptions } = $.extract({
      extractedOptions: [
        {
          selector: 'option',

          value: (el) => {
            const $$ = $(el);

            const value = $$.attr('value');
            const label = $$.text();

            return { value, label };
          },
        },
      ],
    });

    const options = extractedOptions.filter((i) => Boolean(i.value));

    type Option = {
      label: string;
      value: string;
    };

    return options as Option[];
  }

  private compareCityName = (a: string, b: string) => {
    const match = a.localeCompare(b, 'en', {
      usage: 'search',
      localeMatcher: 'best fit',
      sensitivity: 'base',
      ignorePunctuation: true,
    });

    return match === 0;
  };

  private async getInternalCityIdentifier(idCityIbge: string | number) {
    const uf = await this.feriadosDependencies.ibgeService.getUfByCityId(
      idCityIbge,
    );

    const stateOptions = await this.getInternalStateOptions(uf.sigla);

    const city = await this.feriadosDependencies.ibgeService.getCityInfo(
      idCityIbge,
    );

    const cityOption = stateOptions.find((item) =>
      this.compareCityName(item.label, city.nome),
    );

    return {
      estado: uf.sigla.toUpperCase(),
      cidade: cityOption.value,
    };
  }

  private async extractHolidaysCore(
    ano: number | string | null,
    estado: string | null,
    cidade: string | null,
  ): Promise<IHoliday[]> {
    const cookies = new Map();

    if (estado) {
      cookies.set('estado', estado);

      if (cidade) {
        cookies.set('cidade', cidade);
      }
    }

    const cookieHeaderValue = Object.entries(Object.fromEntries(cookies))
      .map((row) => `${row[0]}=${row[1]};`)
      .join(' ');

    const options = {
      method: 'GET',
      headers: {
        Cookie: `${cookieHeaderValue}`,
      },
    };

    const qs = new URLSearchParams();

    if (ano) {
      qs.set('ano', `${ano}`);
    }

    const res = await fetch(
      `https://www.feriados.com.br/?${qs.toString()}`,
      options,
    );

    const html = await res.text();

    const $ = cheerio.load(html, null, false);

    const { feriados } = $.extract({
      feriados: [
        {
          selector: '.multi-column li',
          value: {
            data: {
              selector: 'div',

              value: (el) => {
                return $(el).text().split('-')[0].trim();
              },
            },

            nome: {
              selector: 'div',

              value: (el) => {
                return $(el).text().split('-')[1].trim();
              },
            },

            tipo: {
              selector: 'div[title]',

              value: (el) => {
                const tooltip = $(el).attr('title').trim();
                return cheerio.load(tooltip).text();
              },
            },
          },
        },
      ],
    });

    const holidays = feriados.map((feriado): IHoliday => {
      return {
        date: feriado.data.split('/').reverse().join('-'),
        name: feriado.nome,
        description: feriado.tipo,
      };
    });

    return holidays;
  }

  private async extractHolidays(
    ano: number | string | null,
    estado: string | null,
    cidade: string | null,
  ): Promise<IHoliday[]> {
    return pRetry(
      () => {
        return this.#queue.add(() =>
          this.extractHolidaysCore(ano, estado, cidade),
        );
      },
      {
        retries: 5,
        randomize: true,
        minTimeout: 60 * 60 * 1000,
      },
    );
  }

  async getHolidays(
    year: string | number,
    idStateIbge?: string | number,
    idCityIbge?: string | number,
  ) {
    if (idStateIbge && idCityIbge) {
      const cityOption = await this.getInternalCityIdentifier(idCityIbge);
      return this.extractHolidays(year, cityOption.estado, cityOption.cidade);
    } else if (idStateIbge) {
      const stateInfo =
        await this.feriadosDependencies.ibgeService.getStateInfo(idStateIbge);

      return this.extractHolidays(year, stateInfo.sigla.toUpperCase(), null);
    } else {
      return this.extractHolidays(year, null, null);
    }
  }
}
