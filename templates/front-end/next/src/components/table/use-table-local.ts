'use client';

import { getSessionItem, mask, setSessionItem } from '@softlutions/utils';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props<T, IExtra> {
  confirm?: boolean;
  currentRow?: any;
  dataTable?: T[];
  dataTableFilter?: T[];
  dense?: boolean;
  linesPerPage?: number;
  loading?: boolean;
  page?: number;
  totalPages?: number;
  tab?: any;
  totalElements?: number;
  search?: string;
  extra?: IExtra;
  modulo?: string;
}

export function useTableLocal<T, IExtra = {}>(defultValue = {} as Props<T, IExtra>) {
  const getFilters = (key: string) => {
    const sessionFilters = getSessionItem(`table.filters.${defultValue.modulo}`);
    return sessionFilters ? sessionFilters[key] : undefined;
  }
  
  const defaultValues = useMemo(
    () => ({
      confirm: defultValue.confirm || false,
      currentRow: defultValue.currentRow || null,
      dataTable: defultValue.dataTable || ([] as T[]),
      dataTableFilter: defultValue.dataTableFilter || ([] as T[]),
      dense: defultValue.dense || true,
      linesPerPage: defultValue.linesPerPage || 25,
      loading: defultValue.loading || false,
      page: defultValue.page || 1,
      totalPages: defultValue.totalPages || 1,
      tab: defultValue?.tab?.toString()?.toLocaleLowerCase() || 'all',
      totalElements: defultValue.totalElements || 0,
      type: 'local',
      search: getFilters('search') || defultValue.search || '',
      extra: getFilters('extra') || defultValue.extra || ({} as IExtra),
      modulo: defultValue.modulo || '',
    }),
    [],
  );

  const methods = useForm({
    defaultValues,
  });

  const { setValue, watch } = methods;
  const { dataTable, extra, linesPerPage, page, modulo, search, tab } = watch();

  const prevLinesPerPageRef = useRef(linesPerPage);
  const prevSearchRef = useRef(search);
  const prevTabRef = useRef(tab);
  const prevPageRef = useRef(page);

  const returnFirstPage = () => {
    const prevLinesPerPage = prevLinesPerPageRef.current;
    const prevSearch = prevSearchRef.current;
    const prevTab = prevTabRef.current;
    const prevPage = prevPageRef.current;

    const itemsPerPageChanged = prevLinesPerPage !== linesPerPage;
    const searchChanged = prevSearch !== search;
    const tabChanged = prevTab !== tab;
    const pageChanged = prevPage !== page;

    // Update refs after comparison
    prevLinesPerPageRef.current = linesPerPage;
    prevSearchRef.current = search;
    prevTabRef.current = tab;
    prevPageRef.current = page;

    // Skip initial render
    if (
      prevLinesPerPage === undefined ||
      prevSearch === undefined ||
      prevTab === undefined ||
      prevPage === undefined
    ) {
      return;
    }

    if (itemsPerPageChanged || searchChanged || tabChanged) {
      setValue('page', 1);
      return 1;
    } else if (pageChanged) {
      return page;
    }
  };

  const localFilteringPaging = async (searchKey?: string) => {
    // Funções auxiliares para lidar com chaves aninhadas
    function getAllKeys(obj: any, prefix: string = ''): string[] {
      return Object.keys(obj).reduce<string[]>((keys, key) => {
        const value = obj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          keys.push(...getAllKeys(value, fullKey));
        } else {
          keys.push(fullKey);
        }
        return keys;
      }, []);
    }

    function getValueByPath(obj: any, path: string): any {
      return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }

    // Substituímos apenas a lógica de obter as chaves e de acessar o valor do item
    const fieldsFiltering = dataTable.length > 0 ? (getAllKeys(dataTable[0]) as (keyof T)[]) : [];

    const filtro = dataTable?.filter((item) => {
      const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const searchField = fieldsFiltering.some((campo) => {
        const rawValue = getValueByPath(item, campo as string);
        const itemValue = rawValue?.toString().toLowerCase() || '';
        const searchValue = search?.toLowerCase() || '';

        const normalizedItemValue = removeAccents(itemValue);
        const normalizedSearchValue = removeAccents(searchValue);

        const unmaskedItemValue = mask?.unmasked(itemValue);
        const unmaskedSearchValue = mask?.unmasked(searchValue);

        const normalizedUnmaskedItemValue = removeAccents(unmaskedItemValue);
        const normalizedUnmaskedSearchValue = removeAccents(unmaskedSearchValue);

        return (
          normalizedItemValue.includes(normalizedSearchValue) ||
          normalizedUnmaskedItemValue.includes(normalizedUnmaskedSearchValue)
        );
      });

      if (searchKey) {
        const keys = searchKey.split('.');
        let value: unknown = item;
        keys.forEach((key) => {
          if (typeof value === 'object' && value !== null && key in value) {
            value = (value as Record<string, unknown>)[key];
          } else {
            value = undefined;
          }
        });

        const tabCondition = value?.toString().toLowerCase() === tab?.toString().toLowerCase();
        return searchField && (tab?.toString().toLowerCase() === 'all' || tabCondition);
      }

      return searchField;
    });

    setValue('totalPages', Math.ceil(filtro.length / linesPerPage));
    setValue('totalElements', filtro.length);

    const itemsCurrentPage = Number(returnFirstPage()) * linesPerPage - linesPerPage;

    if (itemsCurrentPage == 0) {
      setValue(
        'dataTableFilter',
        filtro.filter((_, indice) => indice >= itemsCurrentPage && indice < linesPerPage),
      );
    }

    if (itemsCurrentPage > 0) {
      setValue(
        'dataTableFilter',
        filtro.filter(
          (_, indice) => indice > itemsCurrentPage - 1 && indice < itemsCurrentPage + linesPerPage,
        ),
      );
    }
  };

  useEffect(() => {
    setValue('totalPages', Math.ceil(dataTable.length / linesPerPage));
    setValue('totalElements', dataTable.length);
    setValue('dataTableFilter', dataTable.slice(0, linesPerPage));
  }, [dataTable]);

  useEffect(() => {
    if (modulo) {
      setSessionItem(`table.filters.${modulo}`, {
        linesPerPage,
        page,
        search,
        tab,
        extra,
      })
    }
  }, [watch() /*linesPerPage, page, search, tab, extra, modulo*/]);

  return {
    methods,
    localFilteringPaging,
  };
}
