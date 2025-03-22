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
        // Load the track based on its trackType
        const trackConfig = {
          name: `${createTrackName(track)} - ${track.trackType}`,
          url: track.trackUrl,
          height: 100,
          color: track.color,
        };

        // Add color based on track type
        switch (track.trackType) {
          case 'DNase Signal':
            trackConfig.color = '#FF0000';
            break;
          case 'ATAC Signal':
            trackConfig.color = '#00FF00';
            break;
          case 'E2G Predictions':
            trackConfig.color = '#0000FF';
            break;
          case 'Variant Predictions':
            trackConfig.color = '#FF00FF';
            break;
          case 'Elements':
            trackConfig.color = '#00FFFF';
            break;
          default:
            trackConfig.color = '#888888';
        }

        browserRef.current.loadTrack(trackConfig);
      }
    }

    // Remove old tracks
    for (const track of oldTracks) {
      if (!newTracks.has(track)) {
        const trackToRemove = browserRef.current.trackViews.find(
          (trackView: any) => trackView.track.url === track.trackUrl
        );
        
        if (trackToRemove) {
          browserRef.current.removeTrack(trackToRemove.track);
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