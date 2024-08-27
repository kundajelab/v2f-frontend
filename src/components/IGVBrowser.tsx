// IGVBrowser.js
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import igv from 'igv/dist/igv.esm.js';
import { igvTracksSet } from '../state/igv-tracks';
import { useAtom } from 'jotai';


const IGVBrowser = ({locus}: {locus: string}) => {
    const containerRef = useRef(null);
    const [hasRendered, setHasRendered] = useState(false);
    const [tracksSet] = useAtom(igvTracksSet);
    // IGVBrowser is not in TS, so we need to use any here
    const browserRef = useRef<any>(null);
    const prevTrackSet = useRef(new Set(tracksSet));
    useEffect(()=>{
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
        })
      }
    }, [containerRef.current, hasRendered, locus]);

    useEffect(()=>{
      if (!browserRef.current) {
        return;
      }
      for (const track of tracksSet) {
        // load new track if not in previous set
        if (!prevTrackSet.current.has(track)) {
          browserRef.current.loadTrack({
            name: 'ENCODE-rE2G',
            url: track,
            color: '',
            height: 100,
          });
        } else {
          prevTrackSet.current.delete(track);
        }
      }

      // Remove old tracks
    for (const track of prevTrackSet.current) {
      const copy = browserRef.current.trackViews.slice()
        for (let trackView of copy) {
            if (track === trackView.track.url) {
                browserRef.current.removeTrack(trackView.track)
            }
        }
    }

    prevTrackSet.current = new Set(tracksSet);
  }, [tracksSet]);
  return (
    <div ref = {containerRef}>
    </div>
  );
};

export default IGVBrowser;
