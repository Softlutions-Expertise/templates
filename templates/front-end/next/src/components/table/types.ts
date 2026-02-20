import { Dispatch, SetStateAction } from 'react';

// ----------------------------------------------------------------------

interface Tab {
  label: string;
  id: string;
}

export interface ITableProps {
  dataTable: any[];
  setDataTable: Dispatch<SetStateAction<any[]>>;
  dataTableFilter: any[];
  setDataTableFilter: Dispatch<SetStateAction<any[]>>;
  dense: boolean;
  setDense: Dispatch<SetStateAction<boolean>>;
  pageApi: number;
  setPageApi: Dispatch<SetStateAction<number>>;
  totalPagesApi: number;
  settotalPagesApi: Dispatch<SetStateAction<number>>;
  linesPerPage: number;
  setLinesPerPage: Dispatch<SetStateAction<number>>;
  totalItemsApi: number;
  setTotalItemsApi: Dispatch<SetStateAction<number>>;
  searchApi: string;
  setSearchApi: Dispatch<SetStateAction<string>>;
  tab: Tab;
  setTab: Dispatch<SetStateAction<Tab>>;
  denseHeight: number;
  canReset: boolean;
  notFound: boolean;
  emptyRows: () => number;
}
