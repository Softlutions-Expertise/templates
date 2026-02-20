'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { ColorPicker } from '@/components/color-picker/color-picker';

// ----------------------------------------------------------------------

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
  value?: string;
  colors: {
    cor: string;
    nome: string;
  }[];
}

export function RHFColorPicker({ name, label, colors, disabled = false, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <ColorPicker
          label={label}
          selected={field.value}
          onSelectColor={(color) => field.onChange(color)}
          colors={colors?.map((color: any) => color.cor)}
          colorLabel={colors?.map((label) => label.nome)}
          error={error}
        />
      )}
    />
  );
}
