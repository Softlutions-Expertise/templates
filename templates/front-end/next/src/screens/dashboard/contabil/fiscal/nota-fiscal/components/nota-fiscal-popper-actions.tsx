'use client';

import { CustomPopover, usePopover } from '@/components';
import { pages, RouterLink } from '@/routes';
import { Button, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { RiFileList2Line } from 'react-icons/ri';

import { NotaFiscalDialogCreateByXml } from './nota-fiscal-dialog-create-by-xml';

// ----------------------------------------------------------------------

export const NotaFiscalPopperActions = () => {
  const popover = usePopover();
  const anchorRef = useRef<any>(null);

  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <NotaFiscalDialogCreateByXml confirm={confirm} setCofirm={setConfirm} />
      <Stack
        alignItems="flex-end"
        flexDirection="row"
        justifyContent="flex-end"
        sx={{ mt: 3, marginLeft: 'auto' }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            type="button"
            variant="contained"
            onClick={popover.onOpen}
            ref={anchorRef}
            startIcon={<RiFileList2Line />}
          >
            Nova Nota Fiscal
          </Button>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 200, p: 0 }}
        arrow="right-center"
      >
        <Stack p={2} spacing={1}>
          <Button
            variant="contained"
            component={RouterLink}
            href={pages.dashboard.contabil.fiscal.notaFiscal.create.path}
          >
            Manual
          </Button>
          <Button variant="contained" color="info" onClick={() => setConfirm(true)}>
            XML
          </Button>
        </Stack>
      </CustomPopover>
    </>
  );
};
