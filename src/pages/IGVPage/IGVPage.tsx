import { useState, useEffect } from 'react';
import { Box, Paper, Button } from '@mui/material';
import IGVBrowser from '../../components/IGVBrowser';
import { useQuery } from '@apollo/client';
import { DataTracksTableDocument, DataTracksTableQuery } from '../../__generated__/graphql';
import DataTable from '../../components/DataTable';
import Filters from '../../components/Filters';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../../state/igv-tracks';
import BasePage from '../BasePage';
import ExportIGVSession from '../../components/ExportIGV';
import DefaultTracksTable from '../../components/DefaultTracksTable';
import { 
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

const IGVPage = () => {
    const [tracksSet, setTracksSet] = useAtom(igvTracksSet);
    const { data, loading, error } = useQuery<DataTracksTableQuery>(DataTracksTableDocument);

    // State for the selected filters
    const [selectedCellTypes, setSelectedCellTypes] = useState<string[]>([]);
    const [selectedBioSamples, setSelectedBioSamples] = useState<string[]>([]);
    const [selectedTrackTypes, setSelectedTrackTypes] = useState<string[]>([]);
    const [selectedTrackSubTypes, setSelectedTrackSubTypes] = useState<string[]>([]);
    const [selectedFileFormats, setSelectedFileFormats] = useState<string[]>([]); // FileFormats state
    const [selectedBioSampleIds, setSelectedBioSampleIds] = useState<string[]>([]);

    // Optionally adjust the content margin if needed
    const contentMarginTop = tracksSet.size > 0 ? '2vh' : '0';

    // Filtered data based on selected filters
    const filteredData = data?.getDataTracks.filter((track) => {
        const matchesCellType = selectedCellTypes.length === 0 || selectedCellTypes.includes(track.cellType);
        const matchesBioSample = selectedBioSamples.length === 0 || selectedBioSamples.includes(track.bioSample);
        const matchesBioSampleId = selectedBioSampleIds.length === 0 || selectedBioSampleIds.includes(track.bioSampleID);
        const matchesTrackType = selectedTrackTypes.length === 0 || selectedTrackTypes.includes(track.trackType || '');
        const matchesTrackSubType = selectedTrackSubTypes.length === 0 || selectedTrackSubTypes.includes(track.trackSubType || '');
        const matchesFileFormat = selectedFileFormats.length === 0 || selectedFileFormats.includes(track.fileFormat);
        return matchesCellType && matchesBioSample && matchesBioSampleId && matchesTrackType && matchesTrackSubType && matchesFileFormat;
    });

    // Add these functions from DataTable
    const addAllTracks = () => {
        setTracksSet((prevTrackSet) => {
            const newTrackSet = new Set(prevTrackSet);
            filteredData?.forEach((track) => {
                if (track.url) {
                    const trackInfo = {
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

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleAddAllTracksClick = () => {
        if (filteredData && filteredData.length > 10) {
            setOpenConfirmDialog(true);
        } else {
            addAllTracks();
        }
    };

    const handleConfirmAddAllTracks = () => {
        addAllTracks();
        setOpenConfirmDialog(false);
    };

    // Clear the tracks set when the component first mounts
    useEffect(() => {
        setTracksSet(new Set()); // This will clear the set
    }, [setTracksSet]);

    return (
      <BasePage>
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
          <ExportIGVSession />

          <Box sx={{ transition: 'height 0.3s' }}>
            <IGVBrowser locus="chr1:1-248,956,422" />
          </Box>
  
          <Box 
            sx={{ 
              display: 'flex', 
              marginTop: contentMarginTop, 
              transition: 'margin-top 0.3s',
              minHeight: '500px'
            }}
          >
            {/* Left side - Filters */}
            <Box sx={{ width: '25%', padding: 2 }}>
              <DefaultTracksTable />
              <Box sx={{ mt: 3 }}></Box>
              <Filters
                data={data?.getDataTracks || []}
                selectedCellTypes={selectedCellTypes}
                setSelectedCellTypes={setSelectedCellTypes}
                selectedBioSamples={selectedBioSamples}
                setSelectedBioSamples={setSelectedBioSamples}
                selectedBioSampleIds={selectedBioSampleIds}
                setSelectedBioSampleIds={setSelectedBioSampleIds}
                selectedTrackTypes={selectedTrackTypes}
                setSelectedTrackTypes={setSelectedTrackTypes}
                selectedTrackSubTypes={selectedTrackSubTypes}
                setSelectedTrackSubTypes={setSelectedTrackSubTypes}
                selectedFileFormats={selectedFileFormats}
                setSelectedFileFormats={setSelectedFileFormats}
              />
            </Box>

            {/* Right side - DataTable */}
            <Box sx={{ width: '75%', padding: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Button onClick={handleAddAllTracksClick} variant="contained" sx={{ mr: 1 }}>
                  Add All Tracks
                </Button>
                <Button onClick={removeAllTracks} variant="contained" color="secondary">
                  Remove All Tracks
                </Button>
              </Box>
              <Paper sx={{ height: 'fit-content', overflow: 'auto' }}>
                <DataTable
                  data={filteredData || []}
                  loading={loading}
                  error={error}
                  filenameStem="DataTracks"
                />
              </Paper>
            </Box>
          </Box>
  
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
        </Box>
      </BasePage>
    );
};

export default IGVPage;
