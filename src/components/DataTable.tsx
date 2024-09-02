import React from 'react';
import { OtTable, Tooltip } from '../ot-ui-components';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import { DataTrack } from '../__generated__/graphql';

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

const tableColumns = (
  igvTracks: Set<string>,
  addTrack: (track: string) => void,
  removeTrack: (track: string) => void
): TableColumn<DataTrack>[] => [
  {
    id: 'id',
    label: 'ID',
    renderCell: (rowData: DataTrack) => rowData.id,
  },
  {
    id: 'cellType',
    label: 'Cell Type',
    renderCell: (rowData: DataTrack) => rowData.cellType,
  },
  {
    id: 'bioSample',
    label: 'BioSample',
    renderCell: (rowData: DataTrack) => rowData.bioSample,
  },
  {
    id: 'model',
    label: 'Model',
    renderCell: (rowData: DataTrack) => rowData.model || 'N/A',
  },
  {
    id: 'datatrack',
    label: 'DataTrack',
    renderCell: (rowData: DataTrack) => {
      if (rowData.url) {
        const isTrackAdded = igvTracks.has(rowData.url);
        
        return (
          <IconButton onClick={() => isTrackAdded ? removeTrack(rowData.url!) : addTrack(rowData.url!)}>
            {isTrackAdded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        );
      }
      return null;
    },
  },
  {
    id: 'url',
    label: 'URL',
    renderCell: (rowData: DataTrack) => (
      <a href={rowData.url} target="_blank" rel="noopener noreferrer">
        {rowData.url}
      </a>
    ),
  },
];

type DataTableProps = {
  loading: boolean;
  error: any;
  data: DataTrack[];
  filenameStem: string;
};

const DataTable = ({
  loading,
  error,
  data,
  filenameStem,
}: DataTableProps) => {
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);

  const addTrack = (track: string) => {
    setTracksSet((prevTrackSet) => new Set(prevTrackSet).add(track));
  };

  const removeTrack = (track: string) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      newTrackSet.delete(track);
      return newTrackSet;
    });
  };

  return (
    <OtTable
      loading={loading}
      error={error}
      columns={tableColumns(tracksSet, addTrack, removeTrack)}
      data={data}
      sortBy="id" // You can sort by any column; adjust as needed
      order="asc"
      downloadFileStem={filenameStem}
    />
  );
};

export default DataTable;
