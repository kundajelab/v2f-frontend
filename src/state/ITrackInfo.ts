interface ITrackInfo {
    cellType: string;
    bioSample: string;
    trackSubType?: string | null;
    fileFormat: string;
    url: string;
    name?: string;
    color?: string;
  }  
export default ITrackInfo;