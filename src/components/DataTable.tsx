import React, { useState } from 'react';
import { OtTable } from '../ot-ui-components';
import { IconButton, Button, Table, TableBody, TableCell, TableRow, Collapse, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import { DataTrack } from '../__generated__/graphql';
import ITrackInfo from '../state/ITrackInfo';

type DataTableProps = {
  loading: boolean;
  error: any;
  data: DataTrack[];
  filenameStem: string;
};

const DataTable: React.FC<DataTableProps> = ({ loading, error, data, filenameStem }) => {
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Toggle expanded state for each row
  const toggleExpand = (rowId: string) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      newExpandedRows.has(rowId) ? newExpandedRows.delete(rowId) : newExpandedRows.add(rowId);
      return newExpandedRows;
    });
  };

  // Add a single track
  const addTrack = (track: ITrackInfo) => {
    setTracksSet((prevTrackSet) => new Set(prevTrackSet).add(track));
  };

  // Remove a single track
  const removeTrack = (track: ITrackInfo) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      newTrackSet.forEach((t) => {
        if (t.trackUrl === track.trackUrl) {
          newTrackSet.delete(t);
        }
      });
      return newTrackSet;
    });
  };

  // Add all tracks for the specific cellTypeId/study combination
  const addAllTracksForRow = (study: string, cellTypeId: string) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      data.forEach((track) => {
        if (track.study === study && track.cellTypeId === cellTypeId) {
          // Create a track for each available URL
          if (track.dnaseSignalUrl) {
            const trackInfo: ITrackInfo = {
              cellTypeID: track.cellTypeId,
              cellTypeName: track.cellType,
              study: track.study,
              studyUrl: track.paperUrl || '',
              trackUrl: track.dnaseSignalUrl,
              trackType: 'DNase Signal',
              model: track.modelType,
            };
            newTrackSet.add(trackInfo);
          }
          
          if (track.atacSignalUrl) {
            const trackInfo: ITrackInfo = {
              cellTypeID: track.cellTypeId,
              cellTypeName: track.cellType,
              study: track.study,
              studyUrl: track.paperUrl || '',
              trackUrl: track.atacSignalUrl,
              trackType: 'ATAC Signal',
              model: track.modelType,
            };
            newTrackSet.add(trackInfo);
          }
          
          if (track.e2gPredictionsUrl) {
            const trackInfo: ITrackInfo = {
              cellTypeID: track.cellTypeId,
              cellTypeName: track.cellType,
              study: track.study,
              studyUrl: track.paperUrl || '',
              trackUrl: track.e2gPredictionsUrl,
              trackType: 'E2G Predictions',
              model: track.modelType,
            };
            newTrackSet.add(trackInfo);
          }
          
          if (track.variantPredsUrl) {
            const trackInfo: ITrackInfo = {
              cellTypeID: track.cellTypeId,
              cellTypeName: track.cellType,
              study: track.study,
              studyUrl: track.paperUrl || '',
              trackUrl: track.variantPredsUrl,
              trackType: 'Variant Predictions',
              model: track.modelType,
            };
            newTrackSet.add(trackInfo);
          }
          
          if (track.elementsUrl) {
            const trackInfo: ITrackInfo = {
              cellTypeID: track.cellTypeId,
              cellTypeName: track.cellType,
              study: track.study,
              studyUrl: track.paperUrl || '',
              trackUrl: track.elementsUrl,
              trackType: 'Elements',
              model: track.modelType,
            };
            newTrackSet.add(trackInfo);
          }
        }
      });
      return newTrackSet;
    });
  };

  // Prepare data for display - group by cellTypeId and study
  const prepareTableData = () => {
    const uniqueRows = new Map();
    
    data.forEach(track => {
      const key = `${track.cellTypeId}-${track.study}`;
      if (!uniqueRows.has(key)) {
        uniqueRows.set(key, track);
      }
    });
    
    return Array.from(uniqueRows.values());
  };

  // Table is now defined here
  const tableColumns = [
    {
      id: 'cellType',
      label: 'Cell Type',
      renderCell: (rowData: DataTrack) => (
        <Tooltip title={`Cell Type ID: ${rowData.cellTypeId}`} placement="top">
          <span>{rowData.cellType}</span>
        </Tooltip>
      ),
    },
    {
      id: 'study',
      label: 'Study',
      renderCell: (rowData: DataTrack) => rowData.study,
    },
    {
      id: 'model',
      label: 'Model',
      renderCell: (rowData: DataTrack) => rowData.modelType || 'N/A',
    },
    {
      id: 'addAll',
      label: 'Add All Tracks',
      renderCell: (rowData: DataTrack) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => addAllTracksForRow(rowData.study, rowData.cellTypeId)}
        >
          Add All
        </Button>
      ),
    },
  ];

  return (
    <>
      <OtTable
        loading={loading}
        error={error}
        columns={tableColumns}
        data={prepareTableData()}
        sortBy="cellType"
        order="asc"
        downloadFileStem={filenameStem}
        pageSize={20}
      />
    </>
  );
};

export default DataTable;