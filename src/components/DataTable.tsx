import React, { useState } from 'react';
import { OtTable } from '../ot-ui-components';
import { IconButton, Button, Table, TableBody, TableCell, TableRow, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import { DataTrack } from '../__generated__/graphql';

interface ITrackInfo {
  cellType: string;
  bioSample: string;
  trackSubType?: string | null;
  fileFormat: string;
  url: string;
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

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
        if (t.url === track.url) {
          newTrackSet.delete(t);
        }
      });
      return newTrackSet;
    });
  };

  // Add all tracks currently in the table
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

  const removeAllTracks = () => {
    setTracksSet(new Set()); // Clears all tracks by resetting to an empty set
  };

  // Add all tracks for the specific Dataset/BioSample combination
  const addAllTracksForRow = (bioSample: string, cellType: string) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      data.forEach((track) => {
        if (track.bioSample === bioSample && track.cellType === cellType && track.url) {
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


  // Handle "Add All Tracks" button click
  const handleAddAllTracksClick = () => {
    if (data.length > 10) {
      setOpenConfirmDialog(true); // Open dialog if more than 10 tracks
    } else {
      addAllTracks();
    }
  };

  // Confirm and add all tracks when user accepts in dialog
  const handleConfirmAddAllTracks = () => {
    addAllTracks();
    setOpenConfirmDialog(false); // Close dialog after confirmation
  };

  // Table is now defined here
  const tableColumns = [
    {
      id: 'bioSample',
      label: 'DataSet',
      renderCell: (rowData: DataTrack) => rowData.bioSample,
    },
    {
      id: 'cellType',
      label: 'Cell Type',
      renderCell: (rowData: DataTrack) => rowData.cellType,
    },
    {
      id: 'addTracks',
      label: 'Add Tracks',
      renderCell: (rowData: DataTrack) => (
        <Button
          onClick={() => addAllTracksForRow(rowData.bioSample, rowData.cellType)}
          variant="contained"
          color="primary"
          size="small"
        >
          Add Tracks
        </Button>
      ),
    },
    {
      id: 'tracks',
      label: 'Tracks',
      renderCell: (rowData: DataTrack) => (
        <>
          <IconButton onClick={() => toggleExpand(`${rowData.bioSample}-${rowData.cellType}`)}>
            <ExpandMoreIcon />
          </IconButton>
          <Collapse in={expandedRows.has(`${rowData.bioSample}-${rowData.cellType}`)} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {data
                  .filter(
                    (track: DataTrack) =>
                      track.bioSample === rowData.bioSample && track.cellType === rowData.cellType
                  )
                  .map((track: DataTrack) => {
                    const trackInfo: ITrackInfo = {
                      cellType: track.cellType,
                      bioSample: track.bioSample,
                      trackSubType: track.trackSubType || 'N/A',
                      fileFormat: track.fileFormat,
                      url: track.url,
                    };

                    // Check if the track is currently in the tracksSet
                    const isTrackAdded = Array.from(tracksSet).some((t) => t.url === trackInfo.url);

                    return (
                      <TableRow key={track.url}>
                        <TableCell>
                          {track.trackSubType} ({track.fileFormat})
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
                          <IconButton href={track.url} target="_blank" rel="noopener noreferrer">
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
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
      {/* Add All Tracks Button for All Tracks in the Table */}
      <Button onClick={handleAddAllTracksClick} variant="contained" color="primary" style={{ marginBottom: '1rem' }}>
        Add All Tracks
      </Button>
      <Button onClick={removeAllTracks} variant="contained" color="secondary" style={{ marginBottom: '1rem' }}>
        Remove All Tracks
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Add All Tracks</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to add more than 10 tracks. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAddAllTracks} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


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