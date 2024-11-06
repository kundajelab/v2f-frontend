import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { DataTrack } from '../__generated__/graphql';

interface FiltersProps {
  data: DataTrack[];
  selectedCellTypes: string[];
  setSelectedCellTypes: (cellTypes: string[]) => void;
  selectedBioSamples: string[];
  setSelectedBioSamples: (bioSamples: string[]) => void;
  selectedTrackTypes: string[];  // TrackType filter
  setSelectedTrackTypes: (trackTypes: string[]) => void;
  selectedTrackSubTypes: string[]; // TrackSubType filter
  setSelectedTrackSubTypes: (trackSubTypes: string[]) => void;
  selectedFileFormats: string[]; // FileFormats filter
  setSelectedFileFormats: (fileFormats: string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  data,
  selectedCellTypes,
  setSelectedCellTypes,
  selectedBioSamples,
  setSelectedBioSamples,
  selectedTrackTypes,
  setSelectedTrackTypes,
  selectedTrackSubTypes,
  setSelectedTrackSubTypes,
  selectedFileFormats,
  setSelectedFileFormats,
}) => {
  // Extract unique values for cell types, bio samples, track types, track subtypes, and file formats
  const cellTypes = Array.from(new Set(data.map(track => track.cellType)));
  const bioSamples = Array.from(new Set(data.map(track => track.bioSample)));
  const trackTypes = Array.from(new Set(data.map(track => track.trackType || '')));
  const trackSubTypes = Array.from(new Set(data.map(track => track.trackSubType || '')));
  const fileFormats = Array.from(new Set(data.map(track => track.fileFormat)));

  return (
    <Box>
      <Autocomplete
        multiple
        options={cellTypes}
        value={selectedCellTypes}
        onChange={(event, newValue) => setSelectedCellTypes(newValue)}
        renderInput={(params) => <TextField {...params} label="Cell Types" />}
        sx={{ marginBottom: 2 }}
      />
      <Autocomplete
        multiple
        options={bioSamples}
        value={selectedBioSamples}
        onChange={(event, newValue) => setSelectedBioSamples(newValue)}
        renderInput={(params) => <TextField {...params} label="BioSamples" />}
        sx={{ marginBottom: 2 }}
      />
      <Autocomplete
        multiple
        options={trackTypes}
        value={selectedTrackTypes}
        onChange={(event, newValue) => setSelectedTrackTypes(newValue)}
        renderInput={(params) => <TextField {...params} label="Track Types" />}
        sx={{ marginBottom: 2 }}
      />
      <Autocomplete
        multiple
        options={trackSubTypes}
        value={selectedTrackSubTypes}
        onChange={(event, newValue) => setSelectedTrackSubTypes(newValue)}
        renderInput={(params) => <TextField {...params} label="Track SubTypes" />}
        sx={{ marginBottom: 2 }}
      />
      <Autocomplete
        multiple
        options={fileFormats}
        value={selectedFileFormats}
        onChange={(event, newValue) => setSelectedFileFormats(newValue)}
        renderInput={(params) => <TextField {...params} label="File Formats" />}
        sx={{ marginBottom: 2 }}
      />
    </Box>
  );
};

export default Filters;
