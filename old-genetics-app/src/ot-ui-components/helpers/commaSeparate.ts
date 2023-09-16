import { format } from 'd3-format';

const commaSeparateD3 = format(',');

/**
 * Wrap commaSeparateD3 with a function that returns an empty string if the input is null or undefined
 */
const commaSeparate = (value: Parameters<typeof commaSeparateD3>[0] | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return commaSeparateD3(value);
};

export default commaSeparate;
