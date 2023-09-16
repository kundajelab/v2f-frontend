import { OtTable, Link, Tooltip } from '../ot-ui-components';

import { VariantPageEnhancerGenePredictionFragment } from '../__generated__/graphql';
import { ApolloError } from '@apollo/client';
import { HourglassTop } from '@mui/icons-material';

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

const tableColumns = (
  _variantId: string
): TableColumn<VariantPageEnhancerGenePredictionFragment>[] => [
  {
    id: 'isTemporary',
    label: '',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.isTemporary ? (
        <Tooltip title="Temporary prediction uploaded by a user">
          <HourglassTop
            sx={{ opacity: 0.5, fontSize: '20px', verticalAlign: 'middle' }}
          />
        </Tooltip>
      ) : null,
  },
  {
    id: 'cellType',
    label: 'Cell Type',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.cellType,
  },
  {
    id: 'targetGene',
    label: 'Target Gene',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) => (
      <Link key={rowData.targetGene.id} to={`/gene/${rowData.targetGene.id}`}>
        {rowData.targetGene.symbol}
      </Link>
    ),
  },
  {
    id: 'score',
    label: 'Score',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.score.toFixed(3),
  },
  {
    id: 'dataset',
    label: 'Dataset',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.dataset,
  },
  {
    id: 'model',
    label: 'Model',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.model,
  },
  {
    id: 'variantGeneDistance',
    label: 'Variant-Gene Distance',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.variantToGeneDistance,
  },
  {
    id: 'enhancerStart',
    label: 'Enhancer Start',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.enhancerStart,
  },
  {
    id: 'enhanerEnd',
    label: 'Enhancer End',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.enhancerEnd,
  },
  {
    id: 'enhancerClass',
    label: 'Enhancer Class',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.enhancerClass,
  },
  {
    id: 'targetGenePromoterActivityQuantile',
    label: 'Target Gene Promoter Activity Quantile',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) =>
      rowData.targetGenePromoterActivityQuantile,
  },
];

type EnhancerGenePredictionsTableProps = {
  loading: boolean;
  error?: ApolloError;
  filenameStem: string;
  data: VariantPageEnhancerGenePredictionFragment[];
  variantId: string;
};
const EnhancerGenePredictionsTable = ({
  loading,
  error,
  filenameStem,
  data,
  variantId,
}: EnhancerGenePredictionsTableProps) => (
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

export default EnhancerGenePredictionsTable;
