import { forwardRef, useCallback } from 'react';
import { Iconify } from '@/components';
import { Box, FormHelperText, Typography, Stack, ButtonBase } from '@mui/material';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface ColorPickerProps {
  colors: string[];
  selected: string | string[];
  colorLabel: string[];
  onSelectColor: (color: string | string[]) => void;
  limit?: number | 'auto';
  sx?: object;
  error?: {
    message: string;
  };
}

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      colors,
      selected,
      colorLabel,
      onSelectColor,
      limit = 'auto',
      sx,
      error,
      ...other
    },
    ref,
  ) => {
    const singleSelect = typeof selected === 'string';

    const handleSelect = useCallback(
      (color: string) => {
        if (singleSelect) {
          if (color !== selected) {
            onSelectColor(color);
          }
        } else {
          const selectedArray = selected as string[];
          const newSelected = selectedArray.includes(color)
            ? selectedArray.filter((value) => value !== color)
            : [...selectedArray, color];

          onSelectColor(newSelected);
        }
      },
      [onSelectColor, selected, singleSelect],
    );

    return (
      <Stack>
        <Typography variant="overline" sx={{ mb: 1, ml: 1 }}>
          Tipo de evento *
        </Typography>
        <Stack
          ref={ref}
          direction="row"
          display="inline-flex"
          sx={{
            flexWrap: 'wrap',
            ...(limit !== 'auto' && {
              width: limit * 36,
              justifyContent: 'flex-end',
            }),
            ...sx,
          }}
          {...other}
        >
          <Box
            rowGap={1}
            display="grid"
            gridTemplateColumns={'repeat(3, 1fr)'}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {colors.map((color: string, index: number) => {
              const hasSelected = singleSelect
                ? selected === color
                : (selected as string[])?.includes(color);

              return (
                <Stack key={color} direction="row" spacing={0.5} alignItems="center">
                  <ButtonBase
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                    }}
                    onClick={() => {
                      handleSelect(color);
                    }}
                  >
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: color,
                        borderRadius: '50%',
                        border: (theme) =>
                          `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                        ...(hasSelected && {
                          transform: 'scale(1.3)',
                          boxShadow: `4px 4px 8px 0 ${alpha(color, 0.48)}`,
                          outline: `solid 2px ${alpha(color, 0.08)}`,
                          transition: (theme) =>
                            theme.transitions.create('all', {
                              duration: theme.transitions.duration.shortest,
                            }),
                        }),
                      }}
                    >
                      <Iconify
                        width={hasSelected ? 12 : 0}
                        icon="eva:checkmark-fill"
                        sx={{
                          color: (theme) =>
                            theme.palette.getContrastText(color),
                          transition: (theme) =>
                            theme.transitions.create('all', {
                              duration: theme.transitions.duration.shortest,
                            }),
                        }}
                      />
                    </Stack>
                  </ButtonBase>
                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 0.2, cursor: 'pointer' }}
                    onClick={() => {
                      handleSelect(color);
                    }}
                  >
                    {colorLabel[index]}
                  </Typography>
                </Stack>
              );
            })}{' '}
          </Box>
        </Stack>
        {!!error && (
          <FormHelperText error={!!error}>{error?.message}</FormHelperText>
        )}
      </Stack>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
