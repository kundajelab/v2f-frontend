import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { DataTrack } from '../__generated__/graphql';

interface FiltersProps {
  data: DataTrack[];
  selectedCellTypes: string[];
  setSelectedCellTypes: (cellTypes: string[]) => void;
  selectedBioSamples: string[];
  setSelectedBioSamples: (bioSamples: string[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  data,
  selectedCellTypes,
  setSelectedCellTypes,
  selectedBioSamples,
  setSelectedBioSamples,
}) => {
  // Extract unique cell types and bio samples
  const cellTypes = Array.from(new Set(data.map(track => track.cellType)));
  const bioSamples = Array.from(new Set(data.map(track => track.bioSample)));

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
      />
    </Box>
  );
};

export default Filters;
