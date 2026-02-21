'use client';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { ICaixaFindOne, IObjectCodDescricao } from '@/models';
import { fNumber } from '@softlutions/utils';

interface Props {
  caixa: ICaixaFindOne;
}

function getDistinctForms(
  ...arrays: { formaPagamento: IObjectCodDescricao; valor: number }[][]
) {
  const set = new Set<string>();
  arrays.forEach((arr) => {
    arr.forEach((item) => {
      set.add(item.formaPagamento.descricao);
    });
  });
  return Array.from(set);
}

function getValue(
  data: { formaPagamento: IObjectCodDescricao; valor: number }[] = [],
  descricaoPagamento: string,
) {
  return data.find((item) => item.formaPagamento.descricao === descricaoPagamento)?.valor ?? 0;
}

export function LancamentoTableConsolidacao({ caixa }: Props) {
  const distinctForms = getDistinctForms(
    caixa.somaEntradas || [],
    caixa.somaSaidas || [],
    caixa.totais || [],
  );

  return (
    <Card sx={{ p: 0, mb: 2 }}>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              {/* Primeira célula do cabeçalho */}
              <TableCell sx={{ bgcolor: 'background.neutral', color: '#fff' }}>Tipo Pagamento</TableCell>

              {/* Colunas dinâmicas com base nas descrições das formas de pagamento */}
              {distinctForms.map((descricao) => (
                <TableCell
                  key={descricao}
                  sx={{ bgcolor: 'background.neutral', color: '#fff' }}
                  align="center"
                >
                  {descricao}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Linha de Entradas */}
            <TableRow>
              <TableCell>Entradas</TableCell>
              {distinctForms.map((descricao, idx) => {
                const isLast = idx === distinctForms.length - 1;
                return (
                  <TableCell
                    key={descricao}
                    sx={isLast ? { bgcolor: 'background.neutral', color: '#fff' } : undefined}
                    align="center"
                  >
                    R${fNumber('money', getValue(caixa.somaEntradas, descricao))}
                  </TableCell>
                );
              })}
            </TableRow>

            {/* Linha de Saídas */}
            <TableRow>
              <TableCell>Saídas</TableCell>
              {distinctForms.map((descricao, idx) => {
                const isLast = idx === distinctForms.length - 1;
                return (
                  <TableCell
                    key={descricao}
                    sx={isLast ? { bgcolor: 'background.neutral', color: '#fff' } : undefined}
                    align="center"
                  >
                    R${fNumber('money', getValue(caixa.somaSaidas, descricao))}
                  </TableCell>
                );
              })}
            </TableRow>

            {/* Linha de Total */}
            <TableRow>
              <TableCell>Total</TableCell>
              {distinctForms.map((descricao, idx) => {
                const isLast = idx === distinctForms.length - 1;
                return (
                  <TableCell
                    key={descricao}
                    sx={isLast ? { bgcolor: 'background.neutral', color: '#fff' } : undefined}
                    align="center"
                  >
                    R${fNumber('money', getValue(caixa.totais, descricao))}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
