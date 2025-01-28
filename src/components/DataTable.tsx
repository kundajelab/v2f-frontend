import React, { useState, useMemo } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { 
  IconButton, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  TableRow,
  TableCell,
  Table,
  TableBody
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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
  const columns = useMemo<MRT_ColumnDef<DataTrack>[]>(() => [
    {
      accessorKey: 'bioSample',
      header: 'DataSet',
    },
    {
      accessorKey: 'cellType',
      header: 'Cell Type',
    },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   Cell: ({ row }) => (
    //     <Button
    //       onClick={() => addAllTracksForRow(row.original.bioSample, row.original.cellType)}
    //       variant="contained"
    //       size="small"
    //     >
    //       Add Tracks
    //     </Button>
    //   ),
    // },
  ], []);
  
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const addTrack = (track: ITrackInfo) => {
    setTracksSet(prevTrackSet => new Set(prevTrackSet).add(track));
  };

  const removeTrack = (track: ITrackInfo) => {
    setTracksSet(prevTrackSet => {
      const newTrackSet = new Set(prevTrackSet);
      newTrackSet.forEach(t => {
        if (t.url === track.url) newTrackSet.delete(t);
      });
      return newTrackSet;
    });
  };

  const addAllTracks = () => {
    setTracksSet(prevTrackSet => {
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
    setTracksSet(new Set());
  };

  const addAllTracksForRow = (bioSample: string, cellType: string) => {
    setTracksSet(prevTrackSet => {
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

  const handleAddAllTracksClick = () => {
    if (data.length > 10) {
      setOpenConfirmDialog(true);
    } else {
      addAllTracks();
    }
  };

  const handleConfirmAddAllTracks = () => {
    addAllTracks();
    setOpenConfirmDialog(false);
  };
  console.log(useMemo)
  

  const renderDetailPanel = ({ row }: { row: any }) => {
    const matchingTracks = data.filter(
      track => track.bioSample === row.original.bioSample && 
               track.cellType === row.original.cellType
    );

    return (
      <Box sx={{ padding: '1rem' }}>
        <Table size="small">
          <TableBody>
            {matchingTracks.map(track => {
              const trackInfo: ITrackInfo = {
                cellType: track.cellType,
                bioSample: track.bioSample,
                trackSubType: track.trackSubType || 'N/A',
                fileFormat: track.fileFormat,
                url: track.url,
              };
              const isTrackAdded = Array.from(tracksSet).some(t => t.url === trackInfo.url);

              return (
                <TableRow key={track.url}>
                  <TableCell>
                    {track.trackSubType} ({track.fileFormat})
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => isTrackAdded ? removeTrack(trackInfo) : addTrack(trackInfo)}
                      size="small"
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
      </Box>
    );
  };

  return (
    <>
      <Button onClick={handleAddAllTracksClick} variant="contained" sx={{ mb: 1 }}>
        Add All Tracks
      </Button>
      <Button onClick={removeAllTracks} variant="contained" color="secondary" sx={{ mb: 1, ml: 1 }}>
        Remove All Tracks
      </Button>

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

      <MaterialReactTable
        columns={columns}
        data={data}
        enableExpanding
        // renderDetailPanel={renderDetailPanel}
        state={{ isLoading: loading }}
        muiTablePaperProps={{ elevation: 0 }}
        enableColumnActions={false}
        enableColumnFilters={true}
        enablePagination={true}
        enableSorting={true}
        initialState={{
          density: 'compact',
          pagination: { pageSize: 20, pageIndex: 0 }
        }}
      />
    </>
  );
};

export default DataTable;