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
        browserRef.current.loadTrack({
          name: createTrackName(track),
          url: track.url,
          color: '',
          height: 100,
        });
      }
    }

    // Remove old tracks
    for (const track of oldTracks) {
      if (!newTracks.has(track)) {
        const trackToRemove = browserRef.current.trackViews.find((trackView: any) => trackView.track.url === track.url);
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
  return `${track.bioSample} ${track.cellType} ${track.trackSubType} ${track.fileFormat}`;
}

export default IGVBrowser;