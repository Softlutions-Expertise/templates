import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';
import { extractReference } from '../functions/extract-reference';

@Injectable()
export class ForeignKeyViolationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (
          error instanceof QueryFailedError &&
          error.driverError.code === '23503'
        ) {
          return from(extractReference(error.message)).pipe(
            switchMap((referencedTable) => {
              const errorMessage = `Este registro não pode ser removido porque está sendo referenciado em ${referencedTable}.`;
              return throwError(
                () => new HttpException(errorMessage, HttpStatus.CONFLICT),
              );
            }),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
