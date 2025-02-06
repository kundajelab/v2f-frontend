import React, { useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableRow, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import ITrackInfo from '../state/ITrackInfo';

// Default tracks to be loaded into IGV
const defaultTracks: ITrackInfo[] = [
  { cellType: 'CredibleSets', bioSample: '2409_fetal_heart', name: 'CredibleSets', fileFormat: 'bed', url: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/all_CredibleSets.bed' },
  { cellType: 'Variants', bioSample: '2409_fetal_heart', name: 'Variants', fileFormat: 'bed', url: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/all_Variants.bed' },
  { cellType: 'TSS', bioSample: '2409_fetal_heart', name: 'TSS', fileFormat: 'bed', url: 'https://mitra.stanford.edu/engreitz/oak/Users/rosaxma/share/mitra/2409_heartmap/variants_cs/CollapsedGeneBounds.hg38.TSS500bp.bed' },
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
        if (t.url === track.url) {
          newTrackSet.delete(t);
        }
      });
      return newTrackSet;
    });
  };

  // Toggle the track state based on existence in `tracksSet`
  const toggleDefaultTrack = (track: ITrackInfo) => {
    if (Array.from(tracksSet).some((t) => t.url === track.url)) {
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
          {defaultTracks.map((track) => (
            <TableRow key={track.url}>
              <TableCell>{track.name}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => toggleDefaultTrack(track)}
                  color={Array.from(tracksSet).some((t) => t.url === track.url) ? 'primary' : 'default'}
                >
                  {Array.from(tracksSet).some((t) => t.url === track.url) ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DefaultTracksTable;
