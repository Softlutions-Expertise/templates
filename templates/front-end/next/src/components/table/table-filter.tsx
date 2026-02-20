'use client';

import { Box, Button, InputAdornment, Stack, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { FiSearch } from 'react-icons/fi';
import { IoMdTrash } from 'react-icons/io';

// ----------------------------------------------------------------------

export const TableFilter = () => {
  const { watch } = useFormContext();
  const { type } = watch();

  if (type === 'local') return <TableFilterLocal />;

  return <TableFilterApi />;
};

export const TableFilterLocal = () => {
  const { watch, setValue } = useFormContext();
  const { totalElements, search } = watch();

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: 2.5,
          pl: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            placeholder="Pesquise..."
            value={search}
            onChange={(event: any) => setValue('search', event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {search && (
          <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
            <Button color="error" startIcon={<IoMdTrash />} onClick={() => setValue('search', '')}>
              Limpar
            </Button>
          </Stack>
        )}
      </Stack>

      {search && (
        <Stack
          spacing={1.5}
          sx={{
            pr: 2.5,
            pl: 2.5,
            pb: 2,
          }}
        >
          <Box sx={{ typography: 'body2' }}>
            <strong> {totalElements} </strong>
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
              {totalElements > 1 ? 'resultados encontrados' : 'resultado encontrado'}
            </Box>
          </Box>
        </Stack>
      )}
    </>
  );
};

export const TableFilterApi = () => {
  const { watch, setValue } = useFormContext();
  const { totalElements, search } = watch();

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: 2.5,
          pl: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            placeholder="Pesquise..."
            value={search}
            onChange={(event: any) => setValue('search', event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {search && (
          <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
            <Button color="error" startIcon={<IoMdTrash />} onClick={() => setValue('search', '')}>
              Limpar
            </Button>
          </Stack>
        )}
      </Stack>

      {search && (
        <Stack
          spacing={1.5}
          sx={{
            pr: 2.5,
            pl: 2.5,
            pb: 2,
          }}
        >
          <Box sx={{ typography: 'body2' }}>
            <strong> {totalElements} </strong>
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
              {totalElements > 1 ? 'resultados encontrados' : 'resultado encontrado'}
            </Box>
          </Box>
        </Stack>
      )}
    </>
  );
};
