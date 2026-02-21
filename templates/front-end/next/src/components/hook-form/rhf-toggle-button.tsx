'use client';

import React, { useEffect, useState } from 'react';
import { FormHelperText, ToggleButtonGroup, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Controller, useFormContext } from 'react-hook-form';

import { useSettingsContext } from '../settings';

// ----------------------------------------------------------------------

interface Props {
  name: string;
  label?: string;
  disable?: boolean;
  multiple?: boolean;
  children?: any[];
  sx?: any;
}

export function RHFToggleButton({
  name,
  label = '',
  children,
  disable = false,
  multiple = false,
  sx,
}: Props) {
  const { control } = useFormContext();
  const settings = useSettingsContext();

  const [erros, setErros] = useState<any>();

  const [childrens, setChildrens] = useState<any>([]);

  const [borderColor, setBorderColor] = useState<string>(
    settings.themeMode === 'dark' ? '#37424d' : '#e9ecee',
  );

  const [_, setColor] = useState<string>('#919eab');

  useEffect(() => {
    const updatedChildrens = [];

    if (children) {
      for (let i in children) {
        const child = children[i];
        const style = erros ? { color: '#FF5630' } : { color: '#919eab' };
        const updatedChild = React.cloneElement(child, { style });
        updatedChildrens.push(updatedChild);
      }
    }

    setChildrens(updatedChildrens);
  }, [children, erros]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        setErros(error);
        return (
          <Stack direction={'column'} sx={{ width: '100%', ...sx }}>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                mt: -2,
                ml: 1.1,
                zIndex: 999999,
                pl: 0.7,
                color: settings.themeMode === 'dark' ? '#212b36' : '#ffffff',
                bgcolor: settings.themeMode === 'dark' ? '#212b36' : '#ffffff',
                fontWeight: 600,
                fontSize: 12.5,
                userSelect: 'none',
              }}
            >
              {label}/
            </Typography>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                mt: -1.2,
                ml: 1.1,
                zIndex: 999999,
                pl: 0.7,
                color: !!error ? '#FF5630' : settings.themeMode === 'dark' ? '#919eab' : '#637381',
                transition: 'color 0.2s ease',
                fontWeight: 600,
                fontSize: 12.5,
              }}
            >
              {label}
            </Typography>

            <ToggleButtonGroup
              fullWidth
              exclusive={!multiple ? true : false}
              disabled={disable}
              color={'primary'}
              onChange={(_: React.MouseEvent<HTMLElement>, nextView: any) => {
                field.onChange(nextView);
              }}
              value={field.value}
              style={{
                height: 53,
                borderColor: !!error ? '#FF5630' : borderColor,
                transition: 'border-color 0.2s ease',
                color: !!error ? '#FF5630' : borderColor,
              }}
              onMouseEnter={() => {
                setBorderColor(settings.themeMode === 'dark' ? '#ffffff' : '#212b36');
                setColor(settings.themeMode === 'dark' ? '#ffffff' : '#212b36');
              }}
              onMouseLeave={() => {
                setBorderColor(settings.themeMode === 'dark' ? '#37424d' : '#e9ecee');
                setColor('#919eab');
              }}
            >
              {childrens}
            </ToggleButtonGroup>
            <FormHelperText style={{ color: '#FF5630', marginLeft: 14.8 }}>
              {!!error ? error.message : ''}
            </FormHelperText>
          </Stack>
        );
      }}
    />
  );
}
