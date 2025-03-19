import React, { useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableRow, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import ITrackInfo from '../state/ITrackInfo';

// Default tracks to be loaded into IGV
const defaultTracks: ITrackInfo[] = [
  { 
    cellTypeID: 'default_crediblesets',
    cellTypeName: 'CredibleSets',
    study: 'Default',
    studyUrl: '',
    elementsUrl: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/all_CredibleSets.bed'
  },
  { 
    cellTypeID: 'default_variants',
    cellTypeName: 'Variants',
    study: 'Default',
    studyUrl: '',
    elementsUrl: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/all_Variants.bed'
  },
  { 
    cellTypeID: 'default_tss',
    cellTypeName: 'TSS',
    study: 'Default',
    studyUrl: '',
    elementsUrl: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/CollapsedGeneBounds.hg38.TSS500bp.bed'
  },
];

const DefaultTracksTable: React.FC = () => {
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);

  // Initialize default tracks on mount
  useEffect(() => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      defaultTracks.forEach((track) => newTrackSet.add(track));
      return newTrackSet;
    });
  }, [setTracksSet]);

  // Add a track
  const addTrack = (track: ITrackInfo) => {
    setTracksSet((prevTrackSet) => new Set(prevTrackSet).add(track));
  };

  // Remove a track
  const removeTrack = (track: ITrackInfo) => {
    setTracksSet((prevTrackSet) => {
      const newTrackSet = new Set(prevTrackSet);
      newTrackSet.forEach((t) => {
        if (t.cellTypeID === track.cellTypeID && t.study === track.study) {
          newTrackSet.delete(t);
        }
      });
      return newTrackSet;
    });
  };

  // Toggle the track state based on existence in `tracksSet`
  const toggleDefaultTrack = (track: ITrackInfo) => {
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
      <Typography variant="h6">Default Tracks</Typography>
      <Table size="small">
        <TableBody>
          {defaultTracks.map((track) => {
            const isTrackAdded = Array.from(tracksSet).some(
              (t) => t.cellTypeID === track.cellTypeID && t.study === track.study
            );
            
            return (
              <TableRow key={track.cellTypeID}>
                <TableCell>{track.cellTypeName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => toggleDefaultTrack(track)}
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

export default DefaultTracksTable;
