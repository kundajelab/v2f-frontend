import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { DataTrack } from '../__generated__/graphql';

interface FiltersProps {
  data: DataTrack[];
  selectedCellTypes: string[];
  setSelectedCellTypes: (cellTypes: string[]) => void;
  selectedBioSamples: string[];
  setSelectedBioSamples: (bioSamples: string[]) => void;
  selectedTrackSubTypes: string[]; // New filter prop
  setSelectedTrackSubTypes: (trackSubTypes: string[]) => void; // New setter
  selectedFileFormats: string[];
  setSelectedFileFormats: (fileFormats: string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  data,
  selectedCellTypes,
  setSelectedCellTypes,
  selectedBioSamples,
  setSelectedBioSamples,
  selectedTrackSubTypes,
  setSelectedTrackSubTypes,
  selectedFileFormats,
  setSelectedFileFormats
}) => {
  // Extract unique values for cell types, bio samples, track subtypes, and file formats
  const cellTypes = Array.from(new Set(data.map(track => track.cellType)));
  const bioSamples = Array.from(new Set(data.map(track => track.bioSample)));
  const trackSubTypes = Array.from(new Set(data.map(track => track.trackSubType || '')));
  const fileFormats = Array.from(new Set(data.map(track => track.fileFormat)));

  // Determine whether the trackSubType filter should be enabled (if any cellType or bioSample filter is applied)
  const isTrackSubTypeEnabled = selectedCellTypes.length > 0 || selectedBioSamples.length > 0;

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
      {/* Conditionally render the trackSubType filter */}
      {isTrackSubTypeEnabled && (
        <Autocomplete
          multiple
          options={trackSubTypes}
          value={selectedTrackSubTypes}
          onChange={(event, newValue) => setSelectedTrackSubTypes(newValue)}
          renderInput={(params) => <TextField {...params} label="Track SubTypes" />}
          sx={{ marginBottom: 2 }}
        />
      )}
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
