import { format } from 'd3-format';

const commaSeparateD3 = format(',');

/**
 * Wrap commaSeparateD3 with a function that returns an empty string if the input is null or undefined
 */
export const commaSeparate = (value: Parameters<typeof commaSeparateD3>[0] | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return commaSeparateD3(value);
};

/* 
Example usage:
const comparatorDiseaseName = generateComparator(d => d.disease.name);
 */
export function generateComparator<T>(accessor: (item: T) => string | number) {
  return (a: T, b: T) => {
  const aValue = accessor(a);
  const bValue = accessor(b);
  return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
}};

// Consants
export const SIGNIFICANCE = -Math.log10(5e-8);

// chromosome helpers
export * from './chromosome';

// Pages helpers
export * from './gene';
export * from './variant';
export * from './study';
export * from './is-key-of-object';