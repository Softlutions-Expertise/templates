import { Controller} from '@nestjs/common';
import { SecretariaMunicipalEtapaService } from './secretaria-municipal-etapa.service';

@Controller('secretaria-municipal-etapa')
export class SecretariaMunicipalEtapaController {
  constructor(private readonly secretariaMunicipalEtapaService: SecretariaMunicipalEtapaService) {}
}
