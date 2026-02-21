import { SetMetadata, applyDecorators } from '@nestjs/common';
import { NEEDS_AUTH_KEY } from './needs-auth';

export const Public = () => {
  return applyDecorators(SetMetadata(NEEDS_AUTH_KEY, false));
};
