import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Input,
  Stack,
  Typography,
} from '@mui/material';
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { SocketContext } from '../../socket';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import axios from 'axios';

import BasePage from '../BasePage';
import { getApiUrl } from '../../env';
import { set } from 'react-ga';

type File = {
  id: string;
  status: string;
  fileName: string;
  type: string;
  log: string | null;
};

function UploadPage() {
  const socket = useContext(SocketContext);
  const loading = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [queue, setQueue] = useState<File[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    socket.on('gcp-files', (files) => {
      setFiles(files);
    });
    socket.on('gcp-file-queue', (queue) => {
      console.log(queue);
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

  const processDataFile = (id: string, fileName: string) => async () => {
    const response = await axios.post(`${getApiUrl()}/process-gcp-file`, {
      id,
      fileName,
      operation: 'add',
    });
    setFiles(response.data);
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
        {files.map((file) => (
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
                <Button
                  variant="contained"
                  onClick={processDataFile(file.id, file.fileName)}
                >
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
    </BasePage>
  );
}

export default UploadPage;
