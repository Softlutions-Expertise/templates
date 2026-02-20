import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class DefaultException {
  @ApiProperty({ required: true, type: Number, default: 400 })
  statusCode: HttpStatus.BAD_REQUEST;
  @ApiProperty()
  message: [];
  @ApiProperty()
  error: string;
}
