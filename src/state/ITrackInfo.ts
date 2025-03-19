interface ITrackInfo {
    cellTypeID: string;
    cellTypeName: string;
    study: string;
    studyUrl: string;
    dnaseSignalUrl?: string | null;
    atacSignalUrl?: string | null;
    e2gPredictionsUrl?: string | null;
    variantPredictionsUrl?: string | null;
    elementsUrl?: string | null;
    model?: string | null;
  }  
export default ITrackInfo;