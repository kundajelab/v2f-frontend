// IGVBrowser.js
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import igv from 'igv/dist/igv.esm.js';
import { igvTracksSet } from '../state/igv-tracks';
import { useAtom } from 'jotai';
import ITrackInfo from '../state/ITrackInfo';

const IGVBrowser = ({ locus, variantId }: { locus: string, variantId?: string }) => {
  const containerRef = useRef(null);
  const [hasRendered, setHasRendered] = useState(false);
  const [tracksSet] = useAtom(igvTracksSet);
  const browserRef = useRef<any>(null);
  const prevTrackSet = useRef<ITrackInfo[]>(tracksSet);


  useEffect(() => {
    if (containerRef.current && !hasRendered && locus) {
      setHasRendered(true);

      let roi: any[] = [];
      if (variantId) {
        const [chr, pos, ref, alt] = variantId.split('_');
        roi = [
          {
            name: `Variant ${variantId}`,
            color: 'rgba(94,255,1,0.5)',
            indexed: false,
            features: [
              {
                chr: `chr${chr}`,
                start: parseInt(pos) - 1,
                end: parseInt(pos) + ref.length - 1,
              }
            ]
          }
        ]
        
      }

      const browserOptions = {
        genome: 'hg38',
        locus, // Use the passed locus prop here,
        roi,
      };

      const browserPromise: Promise<any> = igv.createBrowser(containerRef.current, browserOptions);
      browserPromise.then((browser) => {
        console.log(browser);
        browserRef.current = browser;
      });
    }
  }, [hasRendered, locus, variantId]);

  useEffect(() => {
    if (!browserRef.current) {
      return;
    }

    const newTracks = [...tracksSet];
    const oldTracks = prevTrackSet.current;

    // Add new tracks
    for (const [index, track] of newTracks.entries()) {
      console.log(track);
      if (!oldTracks.some(t => t.trackUrl === track.trackUrl)) {
        // Load the track based on its trackType
        const trackConfig = {
          name: `${createTrackName(track)} - ${track.trackType}`,
          url: track.trackUrl,
          height: 100,
          color: track.color,
          order: index,
        };

        // Add color based on track type
        switch (track.trackType) {
          case 'DNase Signal':
            trackConfig.color = '#0000FF';
            break;
          case 'ATAC Signal':
            trackConfig.color = '#0000FF';
            break;
          case 'E2G Predictions':
            trackConfig.color = '#FF0000';
            trackConfig.height = 75;
            break;
          case 'Elements':
            trackConfig.color = 'rgb(83, 83, 83)';
            trackConfig.height = 50;
            break;
          default:
            trackConfig.color = '#888888';
        }

        browserRef.current.loadTrack(trackConfig);
      }
    }

    // Remove old tracks
    for (const track of oldTracks) {
      if (!newTracks.some(t => t.trackUrl === track.trackUrl)) {
        const trackToRemove = browserRef.current.trackViews.find(
          (trackView: any) => trackView.track.url === track.trackUrl
        );
        
        if (trackToRemove) {
          browserRef.current.removeTrack(trackToRemove.track);
        }
      }
    }

    prevTrackSet.current = tracksSet;
  }, [tracksSet]);

  return (
    <div ref={containerRef}></div>
  );
};

function createTrackName(track: ITrackInfo) {
  return `${track.cellTypeName} - ${track.study} ${track.model ? `(${track.model})` : ''}`;
}

export default IGVBrowser;