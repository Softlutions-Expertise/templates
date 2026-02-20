'use client';

import { ILabelColor, Label } from '@/components';
import { Tab, Tabs } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  options: { value?: string | boolean | number; label: string; color?: string; searchKey?: any }[];
  searchKey?: string;
}

export function TableTabs({ options, searchKey }: Props) {
  const { watch } = useFormContext();
  const { type } = watch();

  if (type === 'local') {
    return <TableTabsLocal options={options} searchKey={searchKey} />;
  }

  return <TableTabsApi options={options} searchKey={searchKey} />;
}

export function TableTabsLocal({ options, searchKey }: Props) {
  const { watch, setValue } = useFormContext();
  const { tab, dataTable } = watch();

  return (
    <Tabs
      value={tab.toString().toLowerCase()}
      onChange={(_: React.SyntheticEvent, newValue: string) => {
        setValue('page', 1);
        setValue('tab', newValue?.toLocaleLowerCase());
      }}
      sx={{
        px: 2.5,
        boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
      }}
    >
      {options.map((item) => {
        const value =
          item?.value?.toString()?.toLowerCase() || item?.label?.toString().toLowerCase();

        let count = 0;

        if (typeof item.searchKey === 'function') {
          count = item?.searchKey(dataTable);
        } else {
          if (!item.searchKey && item.value === 'all') {
            count = dataTable?.length;
          } else {
            count =
              dataTable?.filter((itemTable: any) => {
                let valueTable = itemTable;

                if (searchKey && !itemTable.searchKey) {
                  const keys = searchKey.split('.');
                  keys.forEach((key) => (valueTable = valueTable?.[key]));
                } else {
                  valueTable = valueTable?.[itemTable.searchKey];
                }

                return valueTable?.toString().toLowerCase() === value?.toString().toLowerCase();
              })?.length || 0;
          }
        }

        return (
          <Tab
            key={value}
            iconPosition="end"
            value={value}
            label={item.label}
            icon={
              <Label
                variant={value === tab.toString().toLowerCase() ? 'filled' : 'soft'}
                color={(item.color as ILabelColor) || 'default'}
              >
                {count}
              </Label>
            }
          />
        );
      })}
    </Tabs>
  );
}

export function TableTabsApi({ options, searchKey }: Props) {
  return <></>;
}
