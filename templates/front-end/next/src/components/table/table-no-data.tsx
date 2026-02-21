'use client';

import { SxProps, TableCell, TableRow, Theme } from '@mui/material';
import { isEqual } from 'lodash';
import { useFormContext } from 'react-hook-form';

import { EmptyContent } from '../empty-content';

// ----------------------------------------------------------------------

interface Props {
  sx?: SxProps<Theme>;
  title?: string;
  endTitle?: string;
  colSpan?: number;
  notFound?: boolean;
}

export function TableNoData({ colSpan = 12, sx, title, endTitle, notFound }: Props) {
  const { watch } = useFormContext();

  const { dataTableFilter, dataTable, type } = watch();

  const data = type === 'local' ? dataTableFilter : dataTable;

  const canReset = !isEqual('', '');

  const found =
    notFound !== undefined && notFound !== null
      ? notFound
      : (!data?.length && canReset) || !data?.length;

  return (
    <TableRow>
      {found ? (
        <TableCell colSpan={colSpan}>
          <EmptyContent
            filled
            title={title ? title : `Não há registros de ${endTitle ? endTitle : 'dados'}`}
            sx={{
              py: 3,
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={colSpan} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
