import { useState, useEffect, useRef } from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import IGVBrowser, { IGVBrowserHandle } from '../../components/IGVBrowser';
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
import ITrackInfo from '../../state/ITrackInfo';
import { useNavigate } from 'react-router-dom-v5-compat';
import { useLocation } from 'react-router-dom';

const IGVPage = () => {
    const [tracksSet, setTracksSet] = useAtom(igvTracksSet);
    const { data, loading, error } = useQuery<DataTracksTableQuery>(DataTracksTableDocument);
    const igvBrowserRef = useRef<IGVBrowserHandle>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [sessionData, setSessionData] = useState<string | null>(null);

    // Check for session parameter and clean URL on mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const sessionParam = searchParams.get('session');
        
        if (sessionParam) {
            // Store the session parameter value
            setSessionData(sessionParam);
            
            // Remove the parameter from URL without page reload
            searchParams.delete('session');
            const newUrl = window.location.pathname + 
                (searchParams.toString() ? `?${searchParams.toString()}` : '');
            
            navigate(newUrl, { replace: true });
        }
    }, [location, navigate]);

    // State for the selected filters
    const [selectedCellTypes, setSelectedCellTypes] = useState<string[]>([]);
    const [selectedCellTypeIds, setSelectedCellTypeIds] = useState<string[]>([]);
    const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    // Optionally adjust the content margin if needed
    const contentMarginTop = tracksSet.length > 0 ? '2vh' : '0';

    // Filtered data based on selected filters
    const filteredData = data?.getDataTracks.filter((track) => {
        const matchesCellType = selectedCellTypes.length === 0 || selectedCellTypes.some(cellType => track.cellType.toLowerCase().includes(cellType.toLowerCase()));
        const matchesCellTypeId = selectedCellTypeIds.length === 0 || selectedCellTypeIds.includes(track.cellTypeId);
        const matchesStudy = selectedStudies.length === 0 || selectedStudies.includes(track.study);
        const matchesModel = selectedModels.length === 0 || (track.modelType && selectedModels.includes(track.modelType));
        return matchesCellType && matchesCellTypeId && matchesStudy && matchesModel;
    });

    // Add all tracks function
    const addAllTracks = () => {
        setTracksSet((prevTrackSet) => {
            const newTrackSet: ITrackInfo[] = [...prevTrackSet];
            filteredData?.forEach((track) => {
                // Add each track type individually


                if (track.e2gPredictionsUrl && !newTrackSet.some(t => t.trackUrl === track.e2gPredictionsUrl)) {
                  newTrackSet.push({
                      cellTypeID: track.cellTypeId,
                      cellTypeName: track.cellType,
                      study: track.study,
                      studyUrl: track.paperUrl || '',
                      trackUrl: track.e2gPredictionsUrl,
                      trackType: 'E2G Predictions',
                      model: track.modelType,
                  });
              }

                if (track.dnaseSignalUrl && !newTrackSet.some(t => t.trackUrl === track.dnaseSignalUrl)) {
                    newTrackSet.push({
                        cellTypeID: track.cellTypeId,
                        cellTypeName: track.cellType,
                        study: track.study,
                        studyUrl: track.paperUrl || '',
                        trackUrl: track.dnaseSignalUrl,
                        trackType: 'DNase Signal',
                        model: track.modelType,
                    });
                }
                if (track.atacSignalUrl && !newTrackSet.some(t => t.trackUrl === track.atacSignalUrl)) {
                    newTrackSet.push({
                        cellTypeID: track.cellTypeId,
                        cellTypeName: track.cellType,
                        study: track.study,
                        studyUrl: track.paperUrl || '',
                        trackUrl: track.atacSignalUrl,
                        trackType: 'ATAC Signal',
                        model: track.modelType,
                    });
                }

                if (track.elementsUrl && !newTrackSet.some(t => t.trackUrl === track.elementsUrl)) {
                    newTrackSet.push({
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
        setTracksSet([]);
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
        setTracksSet([]); // This will clear the set
    }, [setTracksSet]);

    return (
      <BasePage>
        <Typography variant="h5">IGV Browser for Enhancer-Gene Model Predictions</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>
        Add cell types using table below
        </Typography>
        <Box sx={{ width: '100%', minHeight: '100vh', marginTop: '2vh' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ExportIGVSession igvBrowserRef={igvBrowserRef} sessionData={sessionData} />
          </div>

          <Box sx={{ transition: 'height 0.3s' }}>
            <IGVBrowser ref={igvBrowserRef} locus="chr1:1-248,956,422" />
          </Box>
  
          <Typography variant="h6" sx={{ mt: 1, color: 'text.secondary' }}>
            Select cell types:
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>
            Select cell types and studies and click 'Add Tracks' to view E-G predictions in the IGV browser
          </Typography>
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
