import React, { useEffect, useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAtom } from 'jotai';
import { igvTracksSet } from '../state/igv-tracks';
import ITrackInfo from "../state/ITrackInfo";
import { IGVBrowserHandle } from './IGVBrowser';
import { getFeDomain } from '../env';
import {BGZip } from 'igv-utils';

const exclusionFn = (track: any) => {
  return !["wig", "annotation", "interact"].includes(track.type) || track.format === "refgene"
}

const ExportIGVSession: React.FC<{ igvBrowserRef: React.RefObject<IGVBrowserHandle>, sessionData: string | null }> = ({ igvBrowserRef, sessionData }) => {
  const [tracksSet, setTracksSet] = useAtom(igvTracksSet);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionData) {
      const session = JSON.parse(BGZip.uncompressString(sessionData));
      importSessionFromJSON(session);
    }
  }, [sessionData]);

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

  const importSessionFromJSON = (session: any) => {
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
        console.log(importedTracks);
        setTracksSet(importedTracks);
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
    url.pathname = '/igv';
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
        importSessionFromJSON(session);
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
