import React from 'react';
import { OtTable, Tooltip } from '../ot-ui-components';
import { IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import { DataTrack } from '../__generated__/graphql';

// Define the ITrackInfo interface
interface ITrackInfo {
  cellType: string;
  bioSample: string;
  trackSubType?: string | null;
  fileFormat: string;
  url: string;
}

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

// Updated tableColumns function to use ITrackInfo objects
const tableColumns = (
  igvTracks: Set<ITrackInfo>,
  addTrack: (track: ITrackInfo) => void,
  removeTrack: (track: ITrackInfo) => void
): TableColumn<DataTrack>[] => [
  {
    id: 'cellType',
    label: 'Cell Type',
    renderCell: (rowData: DataTrack) => rowData.cellType,
  },
  {
    id: 'bioSample',
    label: 'Dataset',
    renderCell: (rowData: DataTrack) => rowData.bioSample,
  },
  {
    id: 'trackType',
    label: 'Track Type',
    renderCell: (rowData: DataTrack) => rowData.trackType || 'N/A',
  },
  {
    id: 'trackSubType',
    label: 'Track SubType',
    renderCell: (rowData: DataTrack) => rowData.trackSubType || 'N/A',
  },
  {
    id: 'datatrack',
    label: 'DataTrack',
    renderCell: (rowData: DataTrack) => {
      if (rowData.url) {
        const trackInfo: ITrackInfo = {
          cellType: rowData.cellType,
          bioSample: rowData.bioSample,
          trackSubType: rowData.trackSubType || 'N/A',
          fileFormat: 'N/A', // Can update based on available data
          url: rowData.url,
        };

        const isTrackAdded = Array.from(igvTracks).some(
          (track) => track.url === trackInfo.url
        );

        return (
          <IconButton onClick={() => isTrackAdded ? removeTrack(trackInfo) : addTrack(trackInfo)}>
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
      <IconButton
        href={rowData.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <OpenInNewIcon />
      </IconButton>
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

  // Updated addTrack function to handle ITrackInfo
  const addTrack = (track: ITrackInfo) => {
    setTracksSet((prevTrackSet) => new Set(prevTrackSet).add(track));
  };

  // Updated removeTrack function to handle ITrackInfo
  const removeTrack = (track: ITrackInfo) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      newTrackSet.forEach((t) => {
        if (t.url === track.url) {
          newTrackSet.delete(t);
        }
      });
      return newTrackSet;
    });
  };

  // Updated addAllTracks function to handle ITrackInfo
  const addAllTracks = () => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      data.forEach((track) => {
        if (track.url) {
          const trackInfo: ITrackInfo = {
            cellType: track.cellType,
            bioSample: track.bioSample,
            trackSubType: track.trackSubType || 'N/A',
            fileFormat: track.fileFormat,
            url: track.url,
          };
          if (!Array.from(newTrackSet).some((t) => t.url === trackInfo.url)) {
            newTrackSet.add(trackInfo);
          }
        }
      });
      return newTrackSet;
    });
  };

  return (
    <>
      <Button onClick={addAllTracks} variant="contained" color="primary">
        Add All Tracks
      </Button>
      <OtTable
        loading={loading}
        error={error}
        columns={tableColumns(tracksSet, addTrack, removeTrack)}
        data={data}
        sortBy="id" // You can sort by any column; adjust as needed
        order="asc"
        downloadFileStem={filenameStem}
      />
    </>
  );
};

export default DataTable;
