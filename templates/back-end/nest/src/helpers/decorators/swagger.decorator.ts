import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DefaultException } from '../functions/default-exception';

// ----------------------------------------------------------------------

type QueryObject = {
  name: string;
  type?: any;
  enum?: any;
  required?: boolean;
};

// ----------------------------------------------------------------------

export function GetDoc(
  tag: string,
  role: string,
  queries: (string | QueryObject)[] = [],
) {
  const decorators = [
    ApiTags(tag),
    ApiBearerAuth(),
    ApiOperation({ summary: `Perfil de acesso: ${role}` }),
    ApiResponse({ status: 200, description: 'Operação realizada com sucesso' }),
    ApiBadRequestResponse({
      description: 'Erros no envio do conteúdo',
      type: () => DefaultException,
    }),
    ApiUnauthorizedResponse({ description: 'Acesso não autorizado' }),
    ApiResponse({ status: 403, description: 'Requisição recusada' }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor' }),
  ];

  if (queries.length > 0) {
    for (const query of queries) {
      if (typeof query === 'string') {
        decorators.push(ApiQuery({ name: query, required: false }));
      } else {
        decorators.push(ApiQuery(query));
      }
    }
  }

  return applyDecorators(...decorators);
}

// ----------------------------------------------------------------------

export function PostDoc(tag: string, role: string, dto: any) {
  return applyDecorators(
    ApiTags(tag),
    ApiBearerAuth(),
    ApiOperation({ summary: `Perfil de acesso: ${role}` }),
    ApiBody({ type: dto }),
    ApiResponse({ status: 201, description: 'Registro criado com sucesso' }),
    ApiBadRequestResponse({
      description: 'Erros no envio do conteúdo',
      type: () => DefaultException,
    }),
    ApiUnauthorizedResponse({ description: 'Acesso não autorizado' }),
    ApiResponse({ status: 403, description: 'Requisição recusada' }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor' }),
  );
}

// ----------------------------------------------------------------------

export function PatchDoc(tag: string, role: string, dto: any) {
  return applyDecorators(
    ApiTags(tag),
    ApiBearerAuth(),
    ApiOperation({ summary: `Perfil de acesso: ${role}` }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: 200,
      description: 'Registro atualizado com sucesso',
    }),
    ApiBadRequestResponse({
      description: 'Erros no envio do conteúdo',
      type: () => DefaultException,
    }),
    ApiUnauthorizedResponse({ description: 'Acesso não autorizado' }),
    ApiResponse({ status: 403, description: 'Requisição recusada' }),
    ApiResponse({ status: 404, description: 'Não encontrado' }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor' }),
  );
}

// ----------------------------------------------------------------------

export function DeleteDoc(tag: string, role: string) {
  return applyDecorators(
    ApiTags(tag),
    ApiBearerAuth(),
    ApiOperation({ summary: `Perfil de acesso: ${role}` }),
    ApiResponse({ status: 200, description: 'Registro deletado com sucesso' }),
    ApiBadRequestResponse({
      description: 'Erros no envio do conteúdo',
      type: () => DefaultException,
    }),
    ApiUnauthorizedResponse({ description: 'Acesso não autorizado' }),
    ApiResponse({ status: 403, description: 'Requisição recusada' }),
    ApiResponse({ status: 404, description: 'Não encontrado' }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor' }),
  );
}
