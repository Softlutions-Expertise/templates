import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import parseInt from 'lodash/parseInt';

export class ObjectIDDto {
  @ApiProperty({ example: 10 })
  @IsInt()
  @Transform(({ value }) => {
    if (typeof value !== 'number') {
      try {
        const casted = parseInt(value);

        if (!Number.isNaN(casted)) {
          return casted;
        }
      } catch (_) {}
    }

    return value;
  })
  id: number;
}
