'use client';

import { Box, FormControlLabel, MenuItem, Pagination, Select, Switch } from '@mui/material';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

export const TablePagination = () => {
  const { watch } = useFormContext();
  const { type } = watch();
  if (type === 'local') return <TablePaginationLocal />;

  return <TablePaginationApi />;
};

export const TablePaginationLocal = () => {
  const { watch, setValue } = useFormContext();
  const { dense, page, totalPages, linesPerPage } = watch();

  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25];

  const handleDense = (event: any) => {
    setValue('dense', event.target.checked);
  };

  const handleLinesPerPageChange = (event: any) => {
    setValue('linesPerPage', event.target.value);
  };

  const handlePageChange = (_: any, value: any) => {
    setValue('page', value);
  };

  return (
    <>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '10px',
          marginLeft: '15px',
          marginRight: '15px',
          fontSize: '0.875rem',
        }}
      >
        <FormControlLabel
          value="comprimir"
          control={<Switch color="primary" checked={dense} onChange={handleDense} />}
          label="Comprimir tabela"
          labelPlacement="start"
        />
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />

        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span> Itens por página: </span>
          <Select
            value={linesPerPage}
            onChange={handleLinesPerPageChange}
            sx={{
              marginLeft: '10px',
              width: '70px',
              height: '35px',
              '.MuiSelect-select': {
                padding: '8px 14px',
                height: '100%',
                boxSizing: 'border-box',
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: '200px',
                },
              },
            }}
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </>
  );
};

export const TablePaginationApi = () => {
  const { watch, setValue } = useFormContext();
  const { dense, page, totalPages, linesPerPage } = watch();

  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25];

  const handleDense = (event: any) => {
    setValue('dense', event.target.checked);
  };

  const handleLinesPerPageChange = (event: any) => {
    setValue('linesPerPage', event.target.value);
  };

  const handlePageChange = (_: any, value: any) => {
    setValue('page', value);
  };

  return (
    <>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '10px',
          marginLeft: '15px',
          marginRight: '15px',
          fontSize: '0.875rem',
        }}
      >
        <FormControlLabel
          value="comprimir"
          control={<Switch color="primary" checked={dense} onChange={handleDense} />}
          label="Comprimir tabela"
          labelPlacement="start"
        />
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />

        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span> Itens por página: </span>
          <Select
            value={linesPerPage}
            onChange={handleLinesPerPageChange}
            sx={{
              marginLeft: '10px',
              width: '70px',
              height: '35px',
              '.MuiSelect-select': {
                padding: '8px 14px',
                height: '100%',
                boxSizing: 'border-box',
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: '200px',
                },
              },
            }}
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </>
  );
};
