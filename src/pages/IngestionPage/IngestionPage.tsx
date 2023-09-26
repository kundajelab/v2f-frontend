import { Box, Button, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../socket';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import axios from 'axios';

import BasePage from '../BasePage';
import { getApiUrl } from '../../env';

type File = {
  id: string;
  status: string;
  fileName: string;
  type: string;
  log: string | null;
};

function IngestionPage() {
  const socket = useContext(SocketContext);
  const loading = useState(false);
  const [files, setFiles] = useState<File[] | null>([]);
  const [queue, setQueue] = useState<File[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    socket.on('gcp-files', (files) => {
      setFiles(files);
    });
    socket.on('gcp-file-queue', (queue) => {
      setQueue(queue);
    });
  }, [socket]);

  useEffect(() => {
    const loadData = async () => {
      const response = await axios.get(`${getApiUrl()}/gcp-files`);
      const data = response.data as File[];
      setFiles(data);
      setExpanded(
        data.find((file) => file.status === 'Processing')?.fileName || false
      );
    };
    loadData();
  }, []);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const processDataFile = (file: File) => async () => {
    const response = await axios.post(`${getApiUrl()}/process-file`, {
      files: [file],
      operation: 'add',
    });
  };

  const processAllFiles = async () => {
    const filesToProcess = files?.filter(
      (file) => file.status === 'Not Processed'
    );
    const response = await axios.post(`${getApiUrl()}/process-file`, {
      files: filesToProcess,
      operation: 'add',
    });
  };

  return (
    <BasePage>
      <Box>
        {queue.length > 0 && (
          <Box>
            <Typography variant="h4">Queue</Typography>
            <ol>
              {queue.map((file) => (
                <li key={file.id}>{file.fileName}</li>
              ))}
            </ol>
          </Box>
        )}
        <Typography variant="h4" sx={{ marginBottom: '16px' }}>
          Files
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
          Number of Files: {files?.length}
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
          Not Processed:{' '}
          {files?.filter((file) => file.status === 'Not Processed').length}
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
          Queued: {files?.filter((file) => file.status === 'Queued').length}
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
          Processing:{' '}
          {files?.filter((file) => file.status === 'Processing').length}
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
          Processed:{' '}
          {files?.filter((file) => file.status === 'Processed').length}
        </Typography>
        <Button variant="contained" onClick={processAllFiles}>
          Queue All Unprocessed
        </Button>
        <Box sx={{ marginTop: '16px' }}>
          {files?.map((file) => (
            <Accordion
              expanded={expanded === file.fileName}
              onChange={handleChange(file.fileName)}
              key={file.id}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Stack direction="row" width="100%">
                  <Typography sx={{ flex: 1 }}>{file.fileName}</Typography>
                  <Typography sx={{ flex: 1 }}>{file.status}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" width="100%">
                  <Button variant="contained" onClick={processDataFile(file)}>
                    Process Data
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
                >
                  {file.log?.split('\n').map((line, index) => (
                    <Typography key={index}>{line}</Typography>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </BasePage>
  );
}

export default IngestionPage;
