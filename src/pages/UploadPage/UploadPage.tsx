import { Typography, List, ListItem } from '@mui/material';

import BasePage from '../BasePage';
import { EnhancerGenePredictionUploadDescription } from './EnhancerGenePredictionUploadDescription';

function UploadPage() {
  return (
    <BasePage>
      <Typography variant="h6" style={{ marginBottom: '8px' }}>
        Uploading Data
      </Typography>
      <Typography style={{ marginBottom: '8px' }}>
        To upload new data to the E2G portal, please contact Riya Sinha
        (riyasinh@stanford.edu).
      </Typography>
      <Typography variant="h6" style={{ marginBottom: '8px' }}>
        General Guidelines
      </Typography>
      <Typography style={{ marginBottom: '8px' }}>
        You must prepare data according to the following specifications:
      </Typography>
      <Typography style={{ marginBottom: '8px' }}></Typography>
      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        <ListItem sx={{ display: 'list-item' }}>
          Files must be a .tsv file
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          If a row does not have a value for some property, please use "NA"
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Data should follow a "tall" format
        </ListItem>
      </List>
      <EnhancerGenePredictionUploadDescription />
    </BasePage>
  );
}

export default UploadPage;
