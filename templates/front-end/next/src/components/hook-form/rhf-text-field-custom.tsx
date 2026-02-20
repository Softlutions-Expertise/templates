"use client";

import { InputAdornment, Typography } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { fNumber, TfNumber } from "@softlutions/utils";
import { mask as Mask, MaskType, fNumber3 } from "@/utils";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  mask?: keyof MaskType;
  lowerCase?: boolean;
  upperCase?: boolean;
  max?: number;
  readOnly?: boolean;
  shrink?: boolean;
  placeholder?: string;
  type?: "string" | "number" | "password";
};

export function RHFTextFieldCustom({
  name,
  helperText,
  mask,
  type,
  upperCase = false,
  lowerCase = false,
  max,
  readOnly = false,
  shrink = false,
  InputProps,
  placeholder,
  ...other
}: Props) {
  const maskName = mask ? `mask.${name}` : name;

  const { control, formState, setValue, watch } = useFormContext();

  const handleInputProps = () => {
    if (!InputProps?.endAdornment) {
      switch (mask) {
        case "money":
        case "money3":
          return {
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2">R$</Typography>
              </InputAdornment>
            ),
          };
        case "percentage":
          return {
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="body2">%</Typography>
              </InputAdornment>
            ),
          };
        case "kg":
          return {
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="body2">kg</Typography>
              </InputAdornment>
            ),
          };
        default:
          return {};
      }
    } else {
      return InputProps;
    }
  };

  const handlePlaceholder = () => {
    switch (mask) {
      case "percentage":
        return "0";
      case "money":
        return "0,00";
      case "money3":
        return "0";
      case "kg":
        return "0,000";
      default:
        return placeholder;
    }
  };

  const handleOnChange = (event: any, field: any) => {
    let text = event?.target?.value;

    if (upperCase) text = event?.target?.value.toUpperCase();
    if (lowerCase) text = event?.target?.value.toLowerCase();

    if (max) text = text.substring(0, max);

    if (mask && ['money', 'money3', 'percentage', 'kg'].includes(mask)) {
      text = text.replace(/\D/g, '');
    }

    field.onChange(mask ? (Mask as any)?.[mask]?.(text) : text);
  };

  useEffect(() => {
    if (![null, undefined].includes(watch(name))) {
      if (type === "string" || !mask) setValue(maskName, watch(name));
      else {
        if (
          ["money", "number", "numberZeroLeft", "percentage", "kg"].includes(
            mask as string
          ) && ![null, undefined].includes(watch(name))
        ) {
          setValue(maskName, fNumber(mask as TfNumber, watch(name)));
        }
        else if (mask === "money3" && ![null, undefined].includes(watch(name))) {
          setValue(maskName, Mask.money3(watch(name)));
        }
        else {
          setValue(
            maskName,
            Mask?.[mask as keyof MaskType](watch(name), mask as keyof MaskType)
          );
        }
      }
    }
  }, [watch(name)]);

  useEffect(() => {
    if (![null, undefined].includes(watch(maskName))) {
      if (type === "string" || !mask) setValue(name, watch(maskName));
      else {
        if (
          ["money", "number", "numberZeroLeft", "percentage", "kg"].includes(
            mask as string
          ) ||
          type === "number"
        ) {
          setValue(name, fNumber("float", watch(maskName)));
        }
        else if (mask === "money3") {
          setValue(name, fNumber3(watch(maskName)));
        }
        else
          setValue(name, mask === 'time' ? watch(maskName) : Mask.unmasked(watch(maskName), mask as keyof MaskType));
      }
    }
  }, [watch(maskName)]);

  return (
    <Controller
      name={maskName}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          placeholder={handlePlaceholder()}
          type={type === "password" ? "password" : "text"}
          value={field.value}
          onChange={(event) => handleOnChange(event, field)}
          error={!!formState.errors?.[name]}
          helperText={String(formState.errors?.[name]?.message || '') || helperText}
          InputProps={{ readOnly, ...handleInputProps() }}
          {...other}
        />
      )}
    />
  );
}