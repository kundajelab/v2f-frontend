import { Box, Button, Stack } from '@mui/material';
import { useContext } from 'react';
import { SocketContext } from '../../socket';

import axios from 'axios';

import BasePage from '../BasePage';
import { getApiUrl } from '../../env';


function IngestionPage() {
  const socket = useContext(SocketContext);

  const processSheetIngestion = async () => {
    try {
      const response = await axios.post(`${getApiUrl()}/sheet-ingestion`, {});
      console.log('Sheet ingestion initiated:', response.data);
    } catch (error) {
      console.error('Error initiating sheet ingestion:', error);
    }
  };

  return (
    <BasePage>
      <Box>
        <Stack direction="row" spacing={2} sx={{ marginBottom: '16px' }}>
          <Button variant="contained" onClick={processSheetIngestion}>
            Process Sheet Ingestion
          </Button>
        </Stack>
        <Box
          sx={{
            marginTop: '16px',
            backgroundColor: '#eeeeee',
            height: '500px',
            overflow: 'auto',
            padding: '20px',
          }}
        ></Box>
      </Box>
    </BasePage>
  );
}

export default IngestionPage;
