import { OtTable, Tooltip } from '../ot-ui-components';

import { VariantPageBpnetPredictionFragment } from '../__generated__/graphql';
import { ApolloError } from '@apollo/client';
import { HourglassTop } from '@mui/icons-material';
import { DNALogo } from 'logojs-react';

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

const tableColumns = (
  _variantId: string
): TableColumn<VariantPageBpnetPredictionFragment>[] => [
  {
    id: 'isTemporary',
    label: '',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
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
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.cellType,
  },
  {
    id: 'dataset',
    label: 'Dataset',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.dataset,
  },
  {
    id: 'logfc',
    label: 'LogFC',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) => rowData.logfc,
  },
  {
    id: 'logfcPval',
    label: 'LogFC P-value',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.logfcPval,
  },
  {
    id: 'jsd',
    label: 'JSD',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) => rowData.jsd,
  },
  {
    id: 'jsdPval',
    label: 'JSD P-value',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.jsdPval,
  },
  {
    id: 'allele1motif',
    label: 'Allele 1 Motif',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) => (
      <DNALogo ppm={rowData.allele1Motif} height="64px" />
    ),
  },
  {
    id: 'allele1tffam',
    label: 'Allele 1 TF Family',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.allele1TFFamily,
  },
  {
    id: 'allele2motif',
    label: 'Allele 2 Motif',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) => (
      <DNALogo ppm={rowData.allele2Motif} height="64px" />
    ),
  },
  {
    id: 'allele2tffam',
    label: 'Allele 2 TF Family',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.allele2TFFamily,
  },
  {
    id: 'allele1predpercentile',
    label: 'Allele 1 Pred. Counts',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.allele1PredCount,
  },
  {
    id: 'allele2predpercentile',
    label: 'Allele 2 Pred. Counts',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.allele2PredCount,
  },
  {
    id: 'maxpercentile',
    label: 'Max Percentile',
    renderCell: (rowData: VariantPageBpnetPredictionFragment) =>
      rowData.maxPercentile,
  },
];

type BpnetPredictionsTableProps = {
  loading: boolean;
  error?: ApolloError;
  filenameStem: string;
  data: VariantPageBpnetPredictionFragment[];
  variantId: string;
};
const BpnetPredictionsTable = ({
  loading,
  error,
  filenameStem,
  data,
  variantId,
}: BpnetPredictionsTableProps) => (
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

export default BpnetPredictionsTable;
