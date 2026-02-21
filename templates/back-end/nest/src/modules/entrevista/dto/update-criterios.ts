import { PartialType } from '@nestjs/swagger';
import { CreateCriteriosDto } from './create-criterios';

export class UpdateCriteriosDto extends PartialType(CreateCriteriosDto) {}
