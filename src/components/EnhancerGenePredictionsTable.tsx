import { OtTable, Link, Tooltip, Button } from '../ot-ui-components';

import { VariantPageEnhancerGenePredictionFragment } from '../__generated__/graphql';
import { ApolloError } from '@apollo/client';
import { HourglassTop } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { igvTracks } from '../state/igv-tracks';
import { PrimitiveAtom, SetStateAction, useAtom } from 'jotai';

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

const tableColumns = (
  _variantId: string, igvTracks: string[], addTrack: (track: string) => void
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
    id: 'datatrackURL',
    label: 'DataTrack',
    renderCell: (rowData: VariantPageEnhancerGenePredictionFragment) => {
      if (rowData.datatrackURL) {
        return (<IconButton onClick={() => addTrack(rowData.datatrackURL!)}> <AddIcon /> 
        </IconButton>)
      }
      return null;
    }
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
}: EnhancerGenePredictionsTableProps) =>{ 
  const [tracks, setTracks] = useAtom(igvTracks)
  const addTrack = (track: string) => setTracks([...tracks, track])
  return (
  <OtTable
    loading={loading}
    error={error}
    columns={tableColumns(variantId, tracks, addTrack)}
    data={data}
    sortBy="score"
    order="desc"
    downloadFileStem={filenameStem}
  />
)};

export default EnhancerGenePredictionsTable;
