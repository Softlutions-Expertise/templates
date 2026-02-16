'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import { Iconify } from '@/components';
import { CustomBreadcrumbs, useSettingsContext } from '@/components';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from '@/components/table';
import { useRouter } from '@/routes';
import { pages } from '@/routes';
import { IExample } from '@/models';
import { ExampleTableRow } from '../components';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Telefone', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Ações', align: 'right' },
];

// ----------------------------------------------------------------------

// Dados mockados para exemplo
const MOCK_DATA: IExample[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    phone: '(11) 98765-4321',
    document: '123.456.789-00',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    phone: '(11) 98765-4322',
    document: '987.654.321-00',
    status: 'active',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@exemplo.com',
    phone: '(11) 98765-4323',
    document: '456.789.123-00',
    status: 'inactive',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
];

// ----------------------------------------------------------------------

export function ExampleListView() {
  const settings = useSettingsContext();
  const router = useRouter();

  const table = useTable();

  const [tableData, setTableData] = useState<IExample[]>(MOCK_DATA);

  const denseHeight = table.dense ? 52 : 72;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);
      table.onUpdatePageDeleteRowById(id);
    },
    [table, tableData]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(pages.dashboard.example.edit(id));
    },
    [router]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Clientes"
        links={[
          { name: 'Dashboard', href: pages.dashboard.root.path },
          { name: 'Clientes', href: pages.dashboard.example.list.path },
          { name: 'Listar' },
        ]}
        action={
          <Button
            component="a"
            href={pages.dashboard.example.create.path}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Novo Cliente
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.id)
              )
            }
            action={
              <Stack direction="row">
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                >
                  Excluir ({table.selected.length})
                </Button>
              </Stack>
            }
          />

          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {tableData
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <ExampleTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={Math.max(0, table.rowsPerPage - tableData.length)}
              />

              <TableNoData notFound={!tableData.length} />
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={tableData.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
