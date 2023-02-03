import { OtTable, Link } from '../ot-ui-components';

import { VariantPageAbcPredictionFragment } from '../__generated__/graphql';
import { ApolloError } from '@apollo/client';

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

const tableColumns = (
  _variantId: string
): TableColumn<VariantPageAbcPredictionFragment>[] => [
  {
    id: 'cellType',
    label: 'Cell Type',
    renderCell: (rowData: VariantPageAbcPredictionFragment) => rowData.cellType,
  },
  {
    id: 'targetGene',
    label: 'Target Gene',
    renderCell: (rowData: VariantPageAbcPredictionFragment) => (
      <Link key={rowData.targetGene.id} to={`/gene/${rowData.targetGene.id}`}>
        {rowData.targetGene.symbol}
      </Link>
    ),
  },
  {
    id: 'abcScore',
    label: 'ABC Score',
    renderCell: (rowData: VariantPageAbcPredictionFragment) => rowData.score,
  },
  {
    id: 'variantGeneDistance',
    label: 'Variant-Gene Distance',
    renderCell: (rowData: VariantPageAbcPredictionFragment) =>
      rowData.variantToGeneDistance,
  },
  {
    id: 'enhancerStart',
    label: 'Enhancer Start',
    renderCell: (rowData: VariantPageAbcPredictionFragment) =>
      rowData.enhancerStart,
  },
  {
    id: 'enhanerEnd',
    label: 'Enhancer End',
    renderCell: (rowData: VariantPageAbcPredictionFragment) =>
      rowData.enhancerEnd,
  },
  {
    id: 'enhancerClass',
    label: 'Enhancer Class',
    renderCell: (rowData: VariantPageAbcPredictionFragment) =>
      rowData.enhancerClass,
  },
  {
    id: 'targetGenePromoterActivityQuantile',
    label: 'Target Gene Promoter Activity Quantile',
    renderCell: (rowData: VariantPageAbcPredictionFragment) =>
      rowData.targetGenePromoterActivityQuantile,
  },
];

type AbcPredictionsTableProps = {
  loading: boolean;
  error?: ApolloError;
  filenameStem: string;
  data: VariantPageAbcPredictionFragment[];
  variantId: string;
};
const AbcPredictionsTable = ({
  loading,
  error,
  filenameStem,
  data,
  variantId,
}: AbcPredictionsTableProps) => (
  <OtTable
    loading={loading}
    error={error}
    columns={tableColumns(variantId)}
    data={data}
    sortBy="pval"
    order="asc"
    downloadFileStem={filenameStem}
  />
);

export default AbcPredictionsTable;
