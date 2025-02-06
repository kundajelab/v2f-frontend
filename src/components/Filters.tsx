import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { DataTrack } from '../__generated__/graphql';

interface FiltersProps {
  data: DataTrack[];
  selectedCellTypes: string[];
  setSelectedCellTypes: (cellTypes: string[]) => void;
  selectedBioSamples: string[];
  setSelectedBioSamples: (bioSamples: string[]) => void;
  selectedBioSampleIds: string[];
  setSelectedBioSampleIds: (bioSampleIds: string[]) => void;
  selectedTrackTypes: string[];
  setSelectedTrackTypes: (trackTypes: string[]) => void;
  selectedTrackSubTypes: string[];
  setSelectedTrackSubTypes: (trackSubTypes: string[]) => void;
  selectedFileFormats: string[];
  setSelectedFileFormats: (fileFormats: string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  data,
  selectedCellTypes,
  setSelectedCellTypes,
  selectedBioSamples,
  setSelectedBioSamples,
  selectedBioSampleIds,
  setSelectedBioSampleIds,
  selectedTrackTypes,
  setSelectedTrackTypes,
  selectedTrackSubTypes,
  setSelectedTrackSubTypes,
  selectedFileFormats,
  setSelectedFileFormats,
}) => {
  // Get unique values for each filter
  const uniqueCellTypes = Array.from(new Set(data.map((track) => track.cellType)));
  const uniqueBioSamples = Array.from(new Set(data.map((track) => track.bioSample)));
  const uniqueBioSampleIds = Array.from(new Set(data.map((track) => track.bioSampleID)));
  const uniqueTrackTypes = Array.from(new Set(data.map((track) => track.trackType)));
  const uniqueTrackSubTypes = Array.from(new Set(data.map((track) => track.trackSubType || '')));
  const uniqueFileFormats = Array.from(new Set(data.map((track) => track.fileFormat)));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      <Autocomplete
        multiple
        options={uniqueCellTypes}
        value={selectedCellTypes}
        onChange={(_, newValue) => setSelectedCellTypes(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Cell Type" variant="outlined" />
        )}
      />

      <Autocomplete
        multiple
        options={uniqueBioSamples}
        value={selectedBioSamples}
        onChange={(_, newValue) => setSelectedBioSamples(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Dataset Name" variant="outlined" />
        )}
      />

      {/* New BioSample ID Filter */}
      <Autocomplete
        multiple
        options={uniqueBioSampleIds}
        value={selectedBioSampleIds}
        onChange={(_, newValue) => setSelectedBioSampleIds(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Dataset ID" variant="outlined" />
        )}
      />

      <Autocomplete
        multiple
        options={uniqueTrackTypes}
        value={selectedTrackTypes}
        onChange={(_, newValue) => setSelectedTrackTypes(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Track Type" variant="outlined" />
        )}
      />

      <Autocomplete
        multiple
        options={uniqueTrackSubTypes}
        value={selectedTrackSubTypes}
        onChange={(_, newValue) => setSelectedTrackSubTypes(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Track SubType" variant="outlined" />
        )}
      />

      <Autocomplete
        multiple
        options={uniqueFileFormats}
        value={selectedFileFormats}
        onChange={(_, newValue) => setSelectedFileFormats(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Filter by File Format" variant="outlined" />
        )}
      />
    </Box>
  );
};

export default Filters;
