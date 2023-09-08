import { Link, OtTable } from '../ot-ui-components';

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
    id: 'variantGnomadId',
    label: 'Variant',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) => (
      <Link
        key={rowData.variantGnomadId}
        to={`/variant/${rowData.variantGnomadId}`}
      >
        {rowData.variantGnomadId}
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
    id: 'r2',
    label: 'LD (r^2)',
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) => rowData.r2,
  },
  {
    id: 'dprime',
    label: "LD (D')",
    renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
      rowData.dPrime,
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
