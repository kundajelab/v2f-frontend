import { Link, OtTable, Tooltip } from '../ot-ui-components';

import { VariantLinkageDisequilibriumFragment } from '../__generated__/graphql';
import { ApolloError } from '@apollo/client';

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

const tableColumns: TableColumn<VariantLinkageDisequilibriumFragment>[] = [
  {
    id: 'variantId',
    label: 'Variant',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) => (
      <Link key={rowData.variantId} to={`/variant/${rowData.variantId}`}>
        {rowData.variantId}
      </Link>
    ),
  },
  {
    id: 'variantRsId',
    label: 'rsId',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
      rowData.variantRsId,
  },
  {
    id: 'position',
    label: 'Position',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
      rowData.variantPosition,
  },
  {
    id: 'r2',
    label: 'LD (r²)',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) => rowData.r2,
  },
  {
    id: 'dprime',
    label: "LD (D')",
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
      rowData.dPrime,
  },
  {
    id: 'mostSevereConsequence',
    label: 'Most Severe Consequence',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
      rowData.mostSevereConsequence,
  },
  {
    id: 'egCellTypes',
    label: 'Cell Types w/ pred. EG Link',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) => (
      <Tooltip title={rowData.egCellTypes.join(', ')}>
        <div>{rowData.egCellTypes.length}</div>
      </Tooltip>
    ),
  },
  {
    id: 'egGenes',
    label: 'Genes w/ pred. EG link',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) => (
      <Tooltip title={rowData.egGenes.join(', ')}>
        <div>{rowData.egGenes.length}</div>
      </Tooltip>
    ),
  },
];

type LinkageDisequilibriumTableProps = {
  loading: boolean;
  error?: ApolloError;
  filenameStem: string;
  data: VariantLinkageDisequilibriumFragment[];
};
const LinkageDisequilibriumTable = ({
  loading,
  error,
  filenameStem,
  data,
}: LinkageDisequilibriumTableProps) => (
  <OtTable
    loading={loading}
    error={error}
    columns={tableColumns}
    data={data}
    sortBy="r2"
    order="desc"
    downloadFileStem={filenameStem}
  />
);

export default LinkageDisequilibriumTable;
