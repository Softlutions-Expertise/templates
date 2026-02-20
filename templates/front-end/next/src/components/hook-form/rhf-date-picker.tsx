"use client";

import { fDate } from '@softlutions/utils';
import { SxProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  minDate?: Date;
  maxDate?: Date;
  size?: "small" | "medium";
  sx?: SxProps
}

export function RHFDatePicker({
  name,
  label,
  disabled = false,
  value,
  defaultValue,
  minDate,
  maxDate,
  size = "medium",
  sx,
  ...other
}: Props) {
  const maskName = `mask.${name}`;

  const { control, formState, setValue, watch } = useFormContext();

  const formatDate = (date: string) => {
    if (date?.length === 10) return new Date(`${date}T00:00:00`);

    return new Date(date);
  };

  useEffect(() => {
    if (![null, undefined].includes(watch(name)) && (!isNaN(Date.parse(watch(name))) || watch(name) === '')) {
      setValue(maskName, formatDate(watch(name)));
    }

  }, [watch(name)]);

  useEffect(() => {
    if (![null, undefined].includes(watch(maskName)) && (!isNaN(Date.parse(watch(maskName))) || watch(maskName) === '')) {
      setValue(name, fDate("yyyy-MM-dd", watch(maskName)));
    }
  }, [watch(maskName)]);


  return (
    <Controller
      name={maskName}
      control={control}
      render={({ field }) => {
        const isDateValid = field.value && !isNaN(Date.parse(field.value));

        return (
          <DatePicker
            disabled={disabled}
            className=""
            format="dd/MM/yyyy"
            label={label || ""}
            value={
              value
                ? formatDate(value)
                : isDateValid
                  ? formatDate(field.value)
                  : null
            }
            defaultValue={defaultValue && new Date(defaultValue)}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            sx={{ ...sx }}
            minDate={minDate}
            maxDate={maxDate}
            slotProps={{
              textField: {
                size: size,
                fullWidth: true,
                error: !!formState.errors?.[name],
                helperText: String(formState.errors?.[name]?.message || ''),
                placeholder: "DD/MM/AAAA",
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}