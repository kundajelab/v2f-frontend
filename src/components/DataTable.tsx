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

  const removeAllTracksForRow = (study: string, cellTypeId: string) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      newTrackSet.forEach((t) => {
        if (t.study === study && t.cellTypeID === cellTypeId) {
          newTrackSet.delete(t);
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
    /*
    {
      id: 'tracks',
      label: 'Tracks',
      renderCell: (rowData: DataTrack) => (
        <>
          <IconButton onClick={() => toggleExpand(`${rowData.study}-${rowData.cellTypeId}`)}>
            <ExpandMoreIcon />
          </IconButton>
          
          <Collapse in={expandedRows.has(`${rowData.study}-${rowData.cellTypeId}`)} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {data
                  .filter(
                    (track: DataTrack) =>
                      track.study === rowData.study && track.cellTypeId === rowData.cellTypeId
                  )
                  .map((track: DataTrack) => {
                    // Create a list of available tracks for this cell type/study
                    const availableTracks = [];
                    
                    if (track.dnaseSignalUrl) {
                      availableTracks.push({
                        type: 'DNase Signal',
                        url: track.dnaseSignalUrl
                      });
                    }
                    
                    if (track.atacSignalUrl) {
                      availableTracks.push({
                        type: 'ATAC Signal',
                        url: track.atacSignalUrl
                      });
                    }
                    
                    if (track.e2gPredictionsUrl) {
                      availableTracks.push({
                        type: 'E2G Predictions',
                        url: track.e2gPredictionsUrl
                      });
                    }
                    
                    if (track.variantPredsUrl) {
                      availableTracks.push({
                        type: 'Variant Predictions',
                        url: track.variantPredsUrl
                      });
                    }
                    
                    if (track.elementsUrl) {
                      availableTracks.push({
                        type: 'Elements',
                        url: track.elementsUrl
                      });
                    }
                    
                    return availableTracks.map((availableTrack) => {
                      const trackInfo: ITrackInfo = {
                        cellTypeID: track.cellTypeId,
                        cellTypeName: track.cellType,
                        study: track.study,
                        studyUrl: track.paperUrl || '',
                        trackUrl: availableTrack.url,
                        trackType: availableTrack.type,
                        model: track.modelType,
                      };

                      // Check if this specific track is in the tracksSet
                      const isTrackAdded = Array.from(tracksSet).some(
                        (t) => t.trackUrl === trackInfo.trackUrl
                      );

                      return (
                        <TableRow key={availableTrack.url}>
                          <TableCell>
                            {availableTrack.type}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => isTrackAdded ? removeTrack(trackInfo) : addTrack(trackInfo)}
                              size="small"
                              color="primary"
                            >
                              {isTrackAdded ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton href={availableTrack.url} target="_blank" rel="noopener noreferrer">
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })}
              </TableBody>
            </Table>
          </Collapse>
        </>
      ),
    },
    */
    {
      id: 'addAll',
      label: 'Data Tracks',
      renderCell: (rowData: DataTrack) => {
        const isTrackAdded = Array.from(tracksSet).some((t) => t.study === rowData.study && t.cellTypeID === rowData.cellTypeId);
        return (
          <IconButton onClick={() => isTrackAdded ? removeAllTracksForRow(rowData.study, rowData.cellTypeId) : addAllTracksForRow(rowData.study, rowData.cellTypeId)}>
            {isTrackAdded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        );
      }
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
        pageSize={100}
      />
    </>
  );
};

export default DataTable;