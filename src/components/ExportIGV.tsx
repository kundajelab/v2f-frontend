import React from 'react';
import { Button } from '@mui/material';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import ITrackInfo from "../state/ITrackInfo";

const ExportIGVSession: React.FC = () => {
  const [tracksSet] = useAtom(igvTracksSet);

  const exportSession = () => {
    // Collect track information
    const tracks = Array.from(tracksSet).map((track: ITrackInfo) => ({
      name: `${track.bioSample} ${track.cellType} ${track.trackSubType} ${track.fileFormat}`,
      url: track.url,
      color: '#0000FF', // Optional: customize colors as needed
      height: 100,      // Optional: set track height if desired
    }));

    // Create the session object
    const session = {
      genome: 'hg38',         
      locus: 'chr1:1-1000',   
      tracks,
    };

    // Convert the session object to a JSON blob
    const sessionJson = JSON.stringify(session, null, 2); // Pretty-print with 2 spaces
    const blob = new Blob([sessionJson], { type: 'application/json' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'IGV_session.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={exportSession} variant="contained" color="primary">
      Export IGV Session
    </Button>
  );
};

export default ExportIGVSession;
