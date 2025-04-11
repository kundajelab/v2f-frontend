import React, { useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import ITrackInfo from "../state/ITrackInfo";
import { IGVBrowserHandle } from './IGVBrowser';
import { getFeDomain } from '../env';
import {BGZip } from 'igv-utils';

// Define the color function for track types
const getColorForTrackType = (trackType: string): string => {
  switch (trackType.toLowerCase()) {
    case 'signal':
      return '#FF0000';  // Red
    case 'interaction':
      return '#0000FF';  // Blue
    case 'elements':
      return '#00AA00';  // Green
    case 'annotation':
      return '#AA00AA';  // Purple
    default:
      return '#000000';  // Black
  }
};

const exclusionFn = (track: any) => {
  return !["wig", "annotation", "interact"].includes(track.type) || track.format === "refgene"
}

const ExportIGVSession: React.FC<{ igvBrowserRef: React.RefObject<IGVBrowserHandle> }> = ({ igvBrowserRef }) => {
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const exportSession = () => {
    const session = igvBrowserRef.current?.getBrowser()?.toJSON();
    let i = 1;
    for (const track of session.tracks) {
      if (exclusionFn(track)) {
        continue;
      }
      track.order = i;
      const correspondingTrack = tracksSet.find(t => t.trackUrl === track.url);
      track.metadata = {
          cellTypeID: correspondingTrack?.cellTypeID || 'unknown',
          cellTypeName: correspondingTrack?.cellTypeName || 'Unknown',
          study: correspondingTrack?.study || 'Imported',
          trackType: correspondingTrack?.trackType || inferTrackType(track.url),
          model: correspondingTrack?.model || null
      }
      i++;
    }
    return session;
  }

  const exportCompressedSession = () => {
    const session = exportSession();
    const compressedSession = BGZip.compressString(JSON.stringify(session));
    return compressedSession;
  }

  const exportSessionAsFile = () => {
    const session = exportSession();
    const blob = new Blob([JSON.stringify(session)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'IGV_session.json';
    link.click();
    URL.revokeObjectURL(url);
    setOpenExportDialog(false);
  };

  const createShareableLink = async () => {
    const baseUrl = getFeDomain();
    const compressedSession = exportCompressedSession();
    const url = new URL(baseUrl);
    url.searchParams.set('session', compressedSession);

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
        const importedTracks = [];
        for (const track of session.tracks) {
          if (exclusionFn(track)) {
            continue;
          }
          importedTracks.push({
            cellTypeID: track.metadata?.cellTypeID || 'unknown',
            cellTypeName: track.metadata?.cellTypeName || track.name.split(' - ')[0] || 'Unknown',
            study: track.metadata?.study || 'Imported',
            studyUrl: '',
            trackUrl: track.url,
            trackType: track.metadata?.trackType || inferTrackType(track.url),
              model: track.metadata?.model || null,
              color: track.color
          });
        }
        
        setTracksSet(importedTracks);
        setOpenImportDialog(false);
      } catch (error) {
        console.error('Error importing session:', error);
        alert('Failed to import session file. Please ensure it is a valid IGV session JSON.');
      }
    };
    reader.readAsText(file);
  };

  const inferTrackType = (url: string): string => {
    const fileExtension = url.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
    
    switch (fileExtension) {
      case 'bw':
      case 'bigwig':
        return 'Signal';
      case 'bedpe':
        return 'Interaction';
      case 'bed':
        return 'Elements';
      case 'bb':
      case 'bigbed':
        return 'Annotation';
      default:
        return 'Track';
    }
  };

  const importSessionFromUrl = () => {
    const urlString = prompt('Please enter the IGV session URL:');
    if (!urlString) return;

    try {
      const url = new URL(urlString);
      const files = url.searchParams.getAll('file');
      const names = url.searchParams.getAll('name') || [];
      
      const importedTracks = files.map((fileUrl, index) => {
        const trackType = inferTrackType(fileUrl);
        const nameParts = names[index]?.split(' - ') || [];
        const cellTypeName = nameParts[0] || 'Unknown';
        
        return {
          cellTypeID: `imported_${index}`,
          cellTypeName: cellTypeName,
          study: 'Imported',
          studyUrl: '',
          trackUrl: fileUrl,
          trackType: nameParts[1] || trackType,
          model: null,
          color: getColorForTrackType(trackType)
        };
      });

      setTracksSet(importedTracks);
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
