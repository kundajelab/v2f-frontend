import React, { useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableRow, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import ITrackInfo from '../state/ITrackInfo';

// Default tracks to be loaded into IGV
const specialTracks: ITrackInfo[] = [
  { 
    cellTypeID: 'promoters',
    cellTypeName: 'Promoters',
    study: 'Special',
    studyUrl: '',
    trackUrl: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/CollapsedGeneBounds.hg38.TSS500bp.bed',
    trackType: 'bed'
  },
  { 
    cellTypeID: 'crediblesets',
    cellTypeName: 'Credible Sets (Ma*, Conley* et al.)',
    study: 'Special',
    studyUrl: '',
    trackUrl: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/all_CredibleSets.bed',
    trackType: 'bed'
  },
  { 
    cellTypeID: 'variants',
    cellTypeName: 'Variants (Ma*, Conley* et al.)',
    study: 'Special',
    studyUrl: '',
    trackUrl: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/all_Variants.bed',
    trackType: 'bed'
  },
];

const SpecialTracksTable: React.FC = () => {
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);

  // Initialize default tracks on mount
  useEffect(() => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      specialTracks.forEach((track) => newTrackSet.add(track));
      return Array.from(newTrackSet);
    });
  }, [setTracksSet]);

  // Add a track
  const addTrack = (track: ITrackInfo) => {
    setTracksSet((prevTrackSet) => Array.from(new Set(prevTrackSet).add(track)));
  };

  // Remove a track
  const removeTrack = (track: ITrackInfo) => {
    setTracksSet((prevTrackSet) => {
      return prevTrackSet.filter((t) => !(t.cellTypeID === track.cellTypeID && t.study === track.study));
    });
  };

  // Toggle the track state based on existence in `tracksSet`
  const toggleSpecialTrack = (track: ITrackInfo) => {
    const isTrackAdded = Array.from(tracksSet).some(
      (t) => t.cellTypeID === track.cellTypeID && t.study === track.study
    );
    
    if (isTrackAdded) {
      removeTrack(track);
    } else {
      addTrack(track);
    }
  };

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6">Special Tracks</Typography>
      <Table size="small">
        <TableBody>
          {specialTracks.map((track) => {
            const isTrackAdded = Array.from(tracksSet).some(
              (t) => t.cellTypeID === track.cellTypeID && t.study === track.study
            );
            
            return (
              <TableRow key={track.cellTypeID}>
                <TableCell>{track.cellTypeName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => toggleSpecialTrack(track)}
                    color={isTrackAdded ? 'primary' : 'default'}
                  >
                    {isTrackAdded ? <RemoveIcon /> : <AddIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default SpecialTracksTable;
