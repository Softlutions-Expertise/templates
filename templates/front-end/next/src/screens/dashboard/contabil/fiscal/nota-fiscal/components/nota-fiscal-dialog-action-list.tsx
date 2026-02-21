import { ConfirmDialog, CustomPopover, IUseTableApi, TableActions, usePopover, varHover } from '@/components';
import { useError } from '@softlutions/hooks';
import { INotaFiscalFindAll, INotaFiscalFindAllFilter } from '@/models';
import { notaFiscalService } from '@/services';
import { CircularProgress, IconButton, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { m } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GrClone } from 'react-icons/gr';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MdCloudUpload } from 'react-icons/md';
import { TbBrandStocktwits } from 'react-icons/tb';

// ----------------------------------------------------------------------

interface Props {
  row: INotaFiscalFindAll;
  fetchData: () => void;
}

export function NotaFiscalDialogActionList({ row, fetchData }: Props) {
  const handleError = useError();
  const popover = usePopover();

  const { setValue } = useFormContext<IUseTableApi<INotaFiscalFindAll, INotaFiscalFindAllFilter>>();

  const [loadingMovimentar, setLoadingMovimentar] = useState(false);
  const [confirmClonar, setConfirmClonar] = useState(false);
  const [loadingClonar, setLoadingClonar] = useState(false);
  const [currentRow, setCurrentRow] = useState<INotaFiscalFindAll>({} as INotaFiscalFindAll);

  const handleDelete = (id: number) => {
    notaFiscalService
      .remove(id)
      .then(() => {
        enqueueSnackbar('Nota Fiscal deletada com sucesso');
        fetchData();
      })
      .catch((error) => handleError(error, 'Erro ao deletar nota fiscal'))
      .finally(() => setValue('confirm', false));
  };

  const handleMovimentar = (id: number) => {
    setLoadingMovimentar(true);
    setTimeout(() => {
      notaFiscalService
        .movimentar(id)
        .then(() => enqueueSnackbar('Nota fiscal movimentada com sucesso'))
        .catch((error) => handleError(error, 'Erro ao movimentar nota fiscal'))
        .finally(() => setLoadingMovimentar(false));
    }, 1000);
  };

  const handleTransmitir = async (id: number) => {
    notaFiscalService
      .transmitir(id)
      .then((response) => {
        enqueueSnackbar(response.motivo);
      })
      .catch((error) => handleError(error))
      .finally(() => fetchData());
  };

  const handleClonar = (id: number) => {
    setLoadingClonar(true);
    notaFiscalService
      .clonar(id)
      .then(() => {
        enqueueSnackbar('Nota fiscal clonada com sucesso');
        fetchData();
        setConfirmClonar(false);
      })
      .catch((error) => handleError(error, 'Erro ao clonar nota fiscal'))
      .finally(() => setLoadingClonar(false));
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={(event) => {
          setCurrentRow(row);
          setValue('currentRow', row);
          popover.onOpen(event);
        }}
        sx={{
          width: 35,
          height: 35,
        }}
      >
        <HiOutlineDotsVertical />
      </IconButton>

      <CustomPopover
        open={popover.open as any}
        onClose={() => {
          setCurrentRow({} as INotaFiscalFindAll);
          setValue('currentRow', {} as INotaFiscalFindAll);
          popover.onClose();
        }}
        sx={{ width: 50, p: 0, bgcolor: 'background.paper' }}
        arrow="top-center"
      >
        <Stack direction="column" spacing={1}>
          <TableActions
            row={currentRow}
            placement="left"
            disbledHover={true}
            endOtherActions={[
              {
                disabled:
                  ![2, 4].includes(currentRow?.status?.cod) &&
                  !currentRow?.realizadaMovimentacaoEstoque,
                tooltip: 'Movimentar',
                icon:
                  loadingMovimentar ? (
                    <CircularProgress sx={{ color: '#0094eb', mr: 0.5 }} size={20} />
                  ) : (
                    <TbBrandStocktwits color="#0094eb" />
                  ),
                onClick: () => {
                  handleMovimentar(currentRow?.id);
                },
              },
              {
                disabled: ![0, 1].includes(currentRow?.status?.cod),
                tooltip: 'Transmitir',
                icon: <MdCloudUpload />,
                onClick: () => {
                  handleTransmitir(currentRow?.id);
                },
              },
              {
                tooltip: 'Clonar',
                icon: <GrClone />,
                onClick: () => {
                  setConfirmClonar(true);
                  popover.onClose();
                },
              },
            ]}
            deleter={{
              disabled: currentRow?.status?.cod !== 0,
              dialog: {
                nameItem: 'id',
                nameModel: 'Nota Fiscal',
                onClick: () => handleDelete(currentRow.id),
              },
            }}
          />
        </Stack>
      </CustomPopover>

      <ConfirmDialog
        open={confirmClonar}
        onClose={() => setConfirmClonar(false)}
        title="Clonar Nota Fiscal"
        content={`Deseja clonar a nota fiscal ID ${currentRow?.id} - ${currentRow?.nome} - Nº ${currentRow?.numero}?`}
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={() => handleClonar(currentRow?.id)}
            loading={loadingClonar}
          >
            Sim, clonar
          </LoadingButton>
        }
      />
    </>
  );
}
