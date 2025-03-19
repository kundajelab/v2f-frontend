// IGVBrowser.js
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import igv from 'igv/dist/igv.esm.js';
import { igvTracksSet } from '../state/igv-tracks';
import { useAtom } from 'jotai';
import ITrackInfo from '../state/ITrackInfo';

const IGVBrowser = ({ locus }: { locus: string }) => {
  const containerRef = useRef(null);
  const [hasRendered, setHasRendered] = useState(false);
  const [tracksSet] = useAtom(igvTracksSet);
  const browserRef = useRef<any>(null);
  const prevTrackSet = useRef(new Set<ITrackInfo>(tracksSet));

  useEffect(() => {
    if (containerRef.current && !hasRendered && locus) {
      setHasRendered(true);

      const browserOptions = {
        genome: 'hg38',
        locus, // Use the passed locus prop here
      };

      const browserPromise: Promise<any> = igv.createBrowser(containerRef.current, browserOptions);
      browserPromise.then((browser) => {
        console.log(browser);
        browserRef.current = browser;
      });
    }
  }, [hasRendered, locus]);

  useEffect(() => {
    if (!browserRef.current) {
      return;
    }

    const newTracks = new Set(tracksSet);
    const oldTracks = prevTrackSet.current;

    // Add new tracks
    for (const track of newTracks) {
      if (!oldTracks.has(track)) {
        // Check each URL type and add if present
        if (track.dnaseSignalUrl) {
          browserRef.current.loadTrack({
            name: `${createTrackName(track)} - DNase Signal`,
            url: track.dnaseSignalUrl,
            color: '#FF0000',
            height: 100,
          });
        }
        
        if (track.atacSignalUrl) {
          browserRef.current.loadTrack({
            name: `${createTrackName(track)} - ATAC Signal`,
            url: track.atacSignalUrl,
            color: '#00FF00',
            height: 100,
          });
        }
        
        if (track.e2gPredictionsUrl) {
          browserRef.current.loadTrack({
            name: `${createTrackName(track)} - E2G Predictions`,
            url: track.e2gPredictionsUrl,
            color: '#0000FF',
            height: 100,
          });
        }
        
        if (track.variantPredictionsUrl) {
          browserRef.current.loadTrack({
            name: `${createTrackName(track)} - Variant Predictions`,
            url: track.variantPredictionsUrl,
            color: '#FF00FF',
            height: 100,
          });
        }
        
        if (track.elementsUrl) {
          browserRef.current.loadTrack({
            name: `${createTrackName(track)} - Elements`,
            url: track.elementsUrl,
            color: '#00FFFF',
            height: 100,
          });
        }
      }
    }

    // Remove old tracks
    for (const track of oldTracks) {
      if (!newTracks.has(track)) {
        // Check each URL type and remove if present
        if (track.dnaseSignalUrl) {
          const trackToRemove = browserRef.current.trackViews.find(
            (trackView: any) => trackView.track.url === track.dnaseSignalUrl
          );
          if (trackToRemove) {
            browserRef.current.removeTrack(trackToRemove.track);
          }
        }
        
        if (track.atacSignalUrl) {
          const trackToRemove = browserRef.current.trackViews.find(
            (trackView: any) => trackView.track.url === track.atacSignalUrl
          );
          if (trackToRemove) {
            browserRef.current.removeTrack(trackToRemove.track);
          }
        }
        
        if (track.e2gPredictionsUrl) {
          const trackToRemove = browserRef.current.trackViews.find(
            (trackView: any) => trackView.track.url === track.e2gPredictionsUrl
          );
          if (trackToRemove) {
            browserRef.current.removeTrack(trackToRemove.track);
          }
        }
        
        if (track.variantPredictionsUrl) {
          const trackToRemove = browserRef.current.trackViews.find(
            (trackView: any) => trackView.track.url === track.variantPredictionsUrl
          );
          if (trackToRemove) {
            browserRef.current.removeTrack(trackToRemove.track);
          }
        }
        
        if (track.elementsUrl) {
          const trackToRemove = browserRef.current.trackViews.find(
            (trackView: any) => trackView.track.url === track.elementsUrl
          );
          if (trackToRemove) {
            browserRef.current.removeTrack(trackToRemove.track);
          }
        }
      }
    }

    prevTrackSet.current = new Set(tracksSet);
  }, [tracksSet]);

  return (
    <div ref={containerRef}></div>
  );
};

function createTrackName(track: ITrackInfo) {
  return `${track.cellTypeName} - ${track.study} ${track.model ? `(${track.model})` : ''}`;
}

export default IGVBrowser;