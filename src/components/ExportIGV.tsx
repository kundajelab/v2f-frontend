import React, { useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import ITrackInfo from "../state/ITrackInfo";

const ExportIGVSession: React.FC = () => {
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const createSessionObject = () => {
    const tracks = Array.from(tracksSet).map((track: ITrackInfo) => ({
      name: track.study,
      url: track.elementsUrl,
      color: '#0000FF',
      height: 100,
      metadata: {
        bioSample: track.bioSample,
        cellType: track.cellType,
        trackSubType: track.trackSubType,
        fileFormat: track.fileFormat
      }
    }));

    return {
      genome: 'hg38',
      locus: 'chr1:1-1000',
      tracks,
    };
  };

  const exportSessionAsFile = () => {
    const session = createSessionObject();
    const sessionJson = JSON.stringify(session, null, 2);
    const blob = new Blob([sessionJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'IGV_session.json';
    link.click();
    URL.revokeObjectURL(url);
    setOpenExportDialog(false);
  };

  const createShareableLink = async () => {
    const baseUrl = 'https://igv.org/app/';
    const genome = 'hg38';
    const tracks = Array.from(tracksSet);

    const url = new URL(baseUrl);
    url.searchParams.set('genome', genome);

    tracks.forEach((track) => {
      if (track.url) {
        url.searchParams.append('file', track.url);
        url.searchParams.append('name', `${track.cellType} - ${track.bioSample}`);
      }
    });

    try {
      await navigator.clipboard.writeText(url.toString());
      alert('Shareable IGV link copied to clipboard!');
      setOpenExportDialog(false);
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link. Please manually select and copy.');
    }
  };

  const handleImportSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const session = JSON.parse(e.target?.result as string);
        const importedTracks = session.tracks.map((track: any) => ({
          bioSample: track.metadata?.bioSample || track.name || 'Imported',
          cellType: track.metadata?.cellType || 'Unknown',
          trackSubType: track.metadata?.trackSubType || 'Track',
          fileFormat: track.metadata?.fileFormat || track.url.split('.').pop()?.toUpperCase() || 'Unknown',
          url: track.url,
        }));
        
        setTracksSet(new Set(importedTracks));
        setOpenImportDialog(false);
      } catch (error) {
        console.error('Error importing session:', error);
        alert('Failed to import session file. Please ensure it is a valid IGV session JSON.');
      }
    };
    reader.readAsText(file);
  };

  const importSessionFromUrl = () => {
    const urlString = prompt('Please enter the IGV session URL:');
    if (!urlString) return;

    try {
      const url = new URL(urlString);
      const files = url.searchParams.getAll('file');
      const names = url.searchParams.getAll('name') || [];
      
      const importedTracks = files.map((fileUrl, index) => {
        const fileExtension = fileUrl.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
        
        let format;
        switch (fileExtension) {
          case 'bw':
          case 'bigwig':
            format = 'bigWig';
            break;
          case 'bedpe':
            format = 'bedpe';
            break;
          case 'bed':
            format = 'bed';
            break;
          case 'bb':
          case 'bigbed':
            format = 'bigBed';
            break;
          default:
            format = fileExtension || 'Unknown';
        }

        return {
          bioSample: names[index]?.split(' - ')[1] || fileUrl.split('/').pop() || 'Imported',
          cellType: names[index]?.split(' - ')[0] || 'Unknown',
          trackSubType: 'Track',
          fileFormat: format,
          url: fileUrl,
        };
      });

      setTracksSet(new Set(importedTracks));
      setOpenImportDialog(false);
    } catch (error) {
      console.error('Error importing session from URL:', error);
      alert('Failed to import session from URL. Please ensure the URL is valid.');
    }
  };

  return (
    <>
      <Box sx={{mb:2}}>
        <Button variant="contained" onClick={() => setOpenExportDialog(true)} sx={{mr:1}}>
          Export Session
        </Button>
        <Button variant="contained" onClick={() => setOpenImportDialog(true)}>
          Import Session
        </Button>
      </Box>

      {/* Export Dialog */}
      <Dialog open={openExportDialog} onClose={() => setOpenExportDialog(false)}>
        <DialogTitle>Export Session</DialogTitle>
        <DialogContent>
          Choose how you would like to export your session:
        </DialogContent>
        <DialogActions>
          <Button onClick={exportSessionAsFile}>Download JSON</Button>
          <Button onClick={createShareableLink}>Copy Link</Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)}>
        <DialogTitle>Import Session</DialogTitle>
        <DialogContent>
          Choose how you would like to import your session:
        </DialogContent>
        <DialogActions>
          <Button onClick={importSessionFromUrl}>From URL</Button>
          <Button component="label">
            From JSON
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleImportSession}
              ref={fileInputRef}
            />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportIGVSession;
