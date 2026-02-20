import { FilterOperator, FilterSuffix } from 'nestjs-paginate';
import { FilterComparator } from 'nestjs-paginate/lib/filter';

// ----------------------------------------------------------------------

export const FULL_COMPARE_ENUMERABLE = [
  FilterSuffix.NOT,
  FilterComparator.AND,
  FilterComparator.OR,
  FilterOperator.EQ,
  FilterOperator.NULL,
  FilterOperator.IN,
];

// ----------------------------------------------------------------------

export const FULL_COMPARE_NUMERIC = [
  FilterSuffix.NOT,
  FilterComparator.AND,
  FilterComparator.OR,
  FilterOperator.EQ,
  FilterOperator.NULL,
  FilterOperator.GT,
  FilterOperator.GTE,
  FilterOperator.LTE,
  FilterOperator.LT,
  FilterOperator.BTW,
];
