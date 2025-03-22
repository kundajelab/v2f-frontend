import { OtTable, Link, Tooltip, Button } from '../ot-ui-components';
import { VariantPageEnhancerGenePredictionFragment } from '../__generated__/graphql';
import { ApolloError } from '@apollo/client';
import { HourglassTop } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { igvTracksSet } from '../state/igv-tracks';
import { PrimitiveAtom, SetStateAction, useAtom } from 'jotai';
import { useEffect } from 'react';
import ITrackInfo from '../state/ITrackInfo';

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

const tableColumns = (
  _variantId: string, igvTracks: Set<ITrackInfo>, addTrack: (track: ITrackInfo) => void, removeTrack: (track: ITrackInfo) => void
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
      rowData.model || 'N/A', // Default to 'N/A' if model is missing
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
    id: 'enhancerEnd',
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
        const trackInfo: ITrackInfo = {
          cellTypeID: rowData.cellType,
          cellTypeName: rowData.cellType,
          study: rowData.dataset,
          studyUrl: '',
          trackUrl: rowData.datatrackURL,
          trackType: rowData.model,
          model: rowData.model
        };

        const isTrackAdded = Array.from(igvTracks).some(
          (track) => track.trackUrl === trackInfo.trackUrl
        );

        return (
          <IconButton onClick={() => isTrackAdded ? removeTrack(trackInfo) : addTrack(trackInfo)}>
            {isTrackAdded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        );
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
}: EnhancerGenePredictionsTableProps) => { 
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);

  useEffect(() => {
    setTracksSet(new Set()); // This will clear the set on component mount
  }, [setTracksSet]);

  const addTrack = (trackInfo: ITrackInfo) => {
    setTracksSet((prevTrackSet) => new Set(prevTrackSet).add(trackInfo));
  };

  const removeTrack = (trackInfo: ITrackInfo) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      newTrackSet.delete(trackInfo); 
      return newTrackSet;
    });
  };

  return (
    <OtTable
      loading={loading}
      error={error}
      columns={tableColumns(variantId, tracksSet, addTrack, removeTrack)}
      data={data}
      sortBy="score"
      order="desc"
      downloadFileStem={filenameStem}
    />
  );
};

export default EnhancerGenePredictionsTable;
