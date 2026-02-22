'use client';

import {
  Breadcrumbs,
  Container,
  Iconify,
  Label,
  Scrollbar,
  TableActions,
  TableFilter,
  TableNoData,
  TablePagination,
  useTableApi,
} from '@/components';
import { IColaborador, IColaboradorList } from '@/models';
import { pages } from '@/routes';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { ColaboradorService } from '@/services';

import { ColaboradorFormModal, ColaboradorResetPasswordModal } from '../components';
import { COLABORADOR_ENUMS } from '../enums';

// ----------------------------------------------------------------------

export function ColaboradorListView() {
  const handleError = useError();

  const { methods } = useTableApi<IColaboradorList>({ modulo: 'colaborador' });

  const { setValue, watch } = methods;

  const { dense, dataTable, linesPerPage, page, search, currentRow, confirm } = watch();

  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<IColaborador | null>(null);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [resetPasswordItem, setResetPasswordItem] = useState<IColaborador | null>(null);

  const fetchData = () => {
    ColaboradorService
      .index({ linesPerPage, page, search })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar colaboradores'));
  };

  const handleCreate = () => {
    setCurrentItem(null);
    setOpenModal(true);
  };

  const handleEdit = (item: IColaboradorList) => {
    // Buscar detalhes completos do colaborador
    ColaboradorService.show(item.id)
      .then((colaborador) => {
        setCurrentItem(colaborador);
        setOpenModal(true);
      })
      .catch((error) => handleError(error, 'Erro ao carregar colaborador'));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentItem(null);
  };

  const handleResetPassword = (item: IColaboradorList) => {
    // Buscar detalhes completos do colaborador
    ColaboradorService.show(item.id)
      .then((colaborador) => {
        setResetPasswordItem(colaborador);
        setOpenResetPasswordModal(true);
      })
      .catch((error) => handleError(error, 'Erro ao carregar colaborador'));
  };

  const handleCloseResetPasswordModal = () => {
    setOpenResetPasswordModal(false);
    setResetPasswordItem(null);
  };

  const handleSuccess = () => {
    fetchData();
  };

  const handleDelete = async () => {
    if (currentRow) {
      try {
        await ColaboradorService.remove(currentRow.id);
        setValue('confirm', false);
        enqueueSnackbar('Colaborador deletado com sucesso!');
        fetchData();
      } catch (error) {
        handleError(error, 'Erro ao excluir colaborador');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  return (
    <Container>
      <RHFFormProvider methods={methods}>
        <Breadcrumbs
          heading="Listagem de Colaboradores"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            { name: 'Pessoa', href: '#' },
            { name: 'Colaboradores' },
          ]}
          action={
            <Button
              variant="contained"
              onClick={handleCreate}
              startIcon={<span>+</span>}
            >
              Novo Colaborador
            </Button>
          }
        />
        <Card>

          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {COLABORADOR_ENUMS.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable?.map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.nome || '-'}</TableCell>

                      <TableCell>{item.username || '-'}</TableCell>

                      <TableCell>{item.nivelAcesso || '-'}</TableCell>

                      <TableCell>
                        <Label color={item.ativo ? 'success' : 'error'}>
                          {item.ativo ? 'Ativo' : 'Inativo'}
                        </Label>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          edit={{
                            onClick: () => handleEdit(item),
                          }}
                          deleter={{
                            tooltip: 'Excluir',
                            dialog: {
                              title: 'Excluir Colaborador',
                              content: (
                                <>
                                  Deseja excluir o colaborador{' '}
                                  <strong>#{item.id} - {item.nome}</strong>?
                                </>
                              ),
                              nameItem: 'nome',
                              nameModel: 'Colaborador',
                              textConfirm: 'Sim, excluir',
                              onClick: handleDelete,
                            },
                          }}
                          startOtherActions={[
                            {
                              tooltip: 'Redefinir Senha',
                              icon: <Iconify icon="solar:lock-password-bold" />,
                              onClick: () => handleResetPassword(item),
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableNoData />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination />
        </Card>

        <ColaboradorFormModal
          open={openModal}
          currentItem={currentItem}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />

        <ColaboradorResetPasswordModal
          open={openResetPasswordModal}
          currentItem={resetPasswordItem}
          onClose={handleCloseResetPasswordModal}
          onSuccess={handleSuccess}
        />
      </RHFFormProvider>
    </Container>
  );
}
