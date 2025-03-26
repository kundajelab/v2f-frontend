import { useState, useEffect } from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import IGVBrowser from '../../components/IGVBrowser';
import { useQuery } from '@apollo/client';
import { DataTracksTableDocument, DataTracksTableQuery } from '../../__generated__/graphql';
import DataTable from '../../components/DataTable';
import Filters from '../../components/Filters';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../../state/igv-tracks';
import BasePage from '../BasePage';
import ExportIGVSession from '../../components/ExportIGV';
import DefaultTracksTable from '../../components/SpecialTracks';
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
    const [selectedCellTypeIds, setSelectedCellTypeIds] = useState<string[]>([]);
    const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    // Optionally adjust the content margin if needed
    const contentMarginTop = tracksSet.size > 0 ? '2vh' : '0';

    // Filtered data based on selected filters
    const filteredData = data?.getDataTracks.filter((track) => {
        const matchesCellType = selectedCellTypes.length === 0 || selectedCellTypes.includes(track.cellType);
        const matchesCellTypeId = selectedCellTypeIds.length === 0 || selectedCellTypeIds.includes(track.cellTypeId);
        const matchesStudy = selectedStudies.length === 0 || selectedStudies.includes(track.study);
        const matchesModel = selectedModels.length === 0 || (track.modelType && selectedModels.includes(track.modelType));
        return matchesCellType && matchesCellTypeId && matchesStudy && matchesModel;
    });

    // Add all tracks function
    const addAllTracks = () => {
        setTracksSet((prevTrackSet) => {
            const newTrackSet = new Set(prevTrackSet);
            filteredData?.forEach((track) => {
                // Add each track type individually
                if (track.dnaseSignalUrl) {
                    newTrackSet.add({
                        cellTypeID: track.cellTypeId,
                        cellTypeName: track.cellType,
                        study: track.study,
                        studyUrl: track.paperUrl || '',
                        trackUrl: track.dnaseSignalUrl,
                        trackType: 'DNase Signal',
                        model: track.modelType,
                    });
                }
                if (track.atacSignalUrl) {
                    newTrackSet.add({
                        cellTypeID: track.cellTypeId,
                        cellTypeName: track.cellType,
                        study: track.study,
                        studyUrl: track.paperUrl || '',
                        trackUrl: track.atacSignalUrl,
                        trackType: 'ATAC Signal',
                        model: track.modelType,
                    });
                }
                if (track.e2gPredictionsUrl) {
                    newTrackSet.add({
                        cellTypeID: track.cellTypeId,
                        cellTypeName: track.cellType,
                        study: track.study,
                        studyUrl: track.paperUrl || '',
                        trackUrl: track.e2gPredictionsUrl,
                        trackType: 'E2G Predictions',
                        model: track.modelType,
                    });
                }
                if (track.variantPredsUrl) {
                    newTrackSet.add({
                        cellTypeID: track.cellTypeId,
                        cellTypeName: track.cellType,
                        study: track.study,
                        studyUrl: track.paperUrl || '',
                        trackUrl: track.variantPredsUrl,
                        trackType: 'Variant Predictions',
                        model: track.modelType,
                    });
                }
                if (track.elementsUrl) {
                    newTrackSet.add({
                        cellTypeID: track.cellTypeId,
                        cellTypeName: track.cellType,
                        study: track.study,
                        studyUrl: track.paperUrl || '',
                        trackUrl: track.elementsUrl,
                        trackType: 'Elements',
                        model: track.modelType,
                    });
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
                selectedCellTypeIds={selectedCellTypeIds}
                setSelectedCellTypeIds={setSelectedCellTypeIds}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
                selectedModels={selectedModels}
                setSelectedModels={setSelectedModels}
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
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Select cell types and click 'Add Tracks' to view E2G predictions in the IGV browser
                </Typography>
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
