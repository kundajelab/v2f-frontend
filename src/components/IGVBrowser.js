// IGVBrowser.js
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import igv from 'igv/dist/igv.esm.js';

const IGVBrowser = () => {
    const containerRef = useRef(null);
    const [hasRendered, setHasRendered] = useState(false);
    useEffect(()=>{
        if (containerRef.current && !hasRendered) {
            setHasRendered(true);
            igv.createBrowser(containerRef.current, {genome: 'hg38', locus: 'BRCA1'})
        }
    },[containerRef.current])



  return (
    <div ref = {containerRef}>
    </div>
  );
};

export default IGVBrowser;
