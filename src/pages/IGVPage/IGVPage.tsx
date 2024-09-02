import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { Box, Paper, Grid } from '@mui/material'; // Using Material-UI for tabs
import IGVBrowser from '../../components/IGVBrowser';
import { useQuery } from '@apollo/client';
import { DataTracksTableDocument, DataTracksTableQuery } from '../../__generated__/graphql';
import DataTable from '../../components/DataTable';
import Filters from '../../components/Filters';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../../state/igv-tracks';

const IGVPage = () => {
    const [tracksSet, setTracksSet] = useAtom(igvTracksSet);
    const { data, loading, error } = useQuery<DataTracksTableQuery>(DataTracksTableDocument);
  
    // State to store the selected filters, update table as needed
    const [selectedCellTypes, setSelectedCellTypes] = useState<string[]>([]);
    const [selectedBioSamples, setSelectedBioSamples] = useState<string[]>([]);

     // Base height of the IGV browser
    const baseHeight = 30; // 30vh when there are no tracks

    // Additional height per track
    const heightPerTrack = 10; // 10vh for each track

    // Calculate the total height based on the number of tracks
    const igvHeight = `${baseHeight + tracksSet.size * heightPerTrack}vh`;

    // Optionally adjust the content margin if needed (this can remain fixed or change dynamically as well)
    const contentMarginTop = tracksSet.size > 0 ? '2vh' : '0';

  
    // Filtered data based on selected filters
    const filteredData = data?.getDataTracks.filter((track) => {
      const matchesCellType = selectedCellTypes.length === 0 || selectedCellTypes.includes(track.cellType);
      const matchesBioSample = selectedBioSamples.length === 0 || selectedBioSamples.includes(track.bioSample);
      return matchesCellType && matchesBioSample;
    });

    // Clear the tracks set when the component first mounts
    useEffect(() => {
        setTracksSet(new Set()); // This will clear the set
    }, [setTracksSet]);
  
    return (
        <Box sx={{ width: '100%', height: '100vh' }}>
          {/* IGV Browser at the top, height dynamically adjusts based on the number of tracks */}
          <Box sx={{ height: igvHeight, transition: 'height 0.3s' }}>
            <IGVBrowser locus="chr1:1-1000" />
          </Box>
    
          {/* Main content area with filters on the left and data table on the right */}
          <Grid container sx={{ height: `calc(70vh - ${contentMarginTop})`, marginTop: contentMarginTop, transition: 'margin-top 0.3s' }}>
            <Grid item xs={3} sx={{ padding: 2 }}>
              <Filters
                data={data?.getDataTracks || []}
                selectedCellTypes={selectedCellTypes}
                setSelectedCellTypes={setSelectedCellTypes}
                selectedBioSamples={selectedBioSamples}
                setSelectedBioSamples={setSelectedBioSamples}
              />
            </Grid>
            <Grid item xs={9} sx={{ padding: 2 }}>
              <Paper sx={{ height: '100%', overflow: 'auto' }}>
                <DataTable
                  data={filteredData || []}
                  loading={loading}
                  error={error}
                  filenameStem="DataTracks"
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      );
    };
    
    export default IGVPage;