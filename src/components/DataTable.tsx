import React, { useState } from 'react';
import { OtTable } from '../ot-ui-components';
import { IconButton, Button, Table, TableBody, TableCell, TableRow, Collapse, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import { DataTrack } from '../__generated__/graphql';

interface ITrackInfo {
  cellTypeID: string;
  cellTypeName: string;
  study: string;
  studyUrl: string;
  dnaseSignalUrl?: string | null;
  atacSignalUrl?: string | null;
  e2gPredictionsUrl?: string | null;
  variantPredictionsUrl?: string | null;
  elementsUrl?: string | null;
  model?: string | null;
}

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
        if (t.studyUrl === track.studyUrl) {
          newTrackSet.delete(t);
        }
      });
      return newTrackSet;
    });
  };

  // Add all tracks for the specific study/cellType combination
  const addAllTracksForRow = (study: string, cellTypeName: string) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      data.forEach((track) => {
        if (track.study === study && track.cellType === cellTypeName) {
          const trackInfo: ITrackInfo = {
            cellTypeID: track.cellTypeId,
            cellTypeName: track.cellType,
            study: track.study,
            studyUrl: track.paperUrl || '',
            dnaseSignalUrl: track.dnaseSignalUrl,
            atacSignalUrl: track.atacSignalUrl,
            e2gPredictionsUrl: track.e2gPredictionsUrl,
            variantPredictionsUrl: track.variantPredsUrl,
            elementsUrl: track.elementsUrl,
            model: track.modelType,
          };
          
          // Check if this track is already in the set
          const isTrackAlreadyAdded = Array.from(newTrackSet).some(
            (t) => t.cellTypeID === trackInfo.cellTypeID && t.study === trackInfo.study
          );
          
          if (!isTrackAlreadyAdded) {
            newTrackSet.add(trackInfo);
          }
        }
      });
      return newTrackSet;
    });
  };

  // Table is now defined here
  const tableColumns = [
    {
      id: 'cellType',
      label: 'Cell Type',
      renderCell: (rowData: DataTrack) => rowData.cellType,
    },
    {
      id: 'cellTypeId',
      label: 'Cell Type ID',
      renderCell: (rowData: DataTrack) => rowData.cellTypeId,
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
      id: 'tracks',
      label: 'Tracks',
      renderCell: (rowData: DataTrack) => (
        <>
          <IconButton onClick={() => toggleExpand(`${rowData.study}-${rowData.cellTypeId}`)}>
            <ExpandMoreIcon />
          </IconButton>
          
          <Collapse in={expandedRows.has(`${rowData.study}-${rowData.cellTypeId}`)} timeout="auto" unmountOnExit>
            <Box sx={{ mb: 2, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => addAllTracksForRow(rowData.study, rowData.cellType)}
              >
                Add All Tracks
              </Button>
            </Box>
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
                        dnaseSignalUrl: availableTrack.type === 'DNase Signal' ? availableTrack.url : null,
                        atacSignalUrl: availableTrack.type === 'ATAC Signal' ? availableTrack.url : null,
                        e2gPredictionsUrl: availableTrack.type === 'E2G Predictions' ? availableTrack.url : null,
                        variantPredictionsUrl: availableTrack.type === 'Variant Predictions' ? availableTrack.url : null,
                        elementsUrl: availableTrack.type === 'Elements' ? availableTrack.url : null,
                        model: track.modelType,
                      };

                      // Check if this specific track is in the tracksSet
                      const isTrackAdded = Array.from(tracksSet).some((t) => {
                        if (availableTrack.type === 'DNase Signal') {
                          return t.dnaseSignalUrl === availableTrack.url;
                        } else if (availableTrack.type === 'ATAC Signal') {
                          return t.atacSignalUrl === availableTrack.url;
                        } else if (availableTrack.type === 'E2G Predictions') {
                          return t.e2gPredictionsUrl === availableTrack.url;
                        } else if (availableTrack.type === 'Variant Predictions') {
                          return t.variantPredictionsUrl === availableTrack.url;
                        } else if (availableTrack.type === 'Elements') {
                          return t.elementsUrl === availableTrack.url;
                        }
                        return false;
                      });

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
  ];

  return (
    <>
      <OtTable
        loading={loading}
        error={error}
        columns={tableColumns}
        data={data}
        sortBy="id"
        order="asc"
        downloadFileStem={filenameStem}
        pageSize={20}
      />
    </>
  );
};

export default DataTable;