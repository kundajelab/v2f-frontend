import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Input,
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

import axios from 'axios';

import BasePage from '../BasePage';
import { AbcPredictionUploadDescription } from './AbcPredictionUploadDescription';

function UploadPage() {
  const socket = useContext(SocketContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataProgressLogs, setDataProgressLogs] = useState<string[]>([]);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isTemporaryData, setIsTemporaryData] = useState(true);
  const logBoxRef = useRef<HTMLElement>();

  useEffect(() => {
    socket.on('upload-data-progress', (v) => {
      setDataProgressLogs((prevLogs: string[]) => [...prevLogs, v.toString()]);
    });
  }, [socket]);

  const onSubmit = async (e: MouseEvent) => {
    if (!selectedFile) {
      return;
    }
    setDataProgressLogs([]);
    const formData = new FormData();
    formData.append('data', selectedFile, 'data');
    formData.append('socketId', socket.id);
    formData.append('isTemporary', isTemporaryData.toString());
    try {
      const response = await axios.post(
        'http://localhost:4000/upload-data',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    const logBox = logBoxRef.current;
    if (!logBox) {
      return;
    }
    logBox.addEventListener('scroll', handleUserScroll);
    return () => logBox.removeEventListener('scroll', handleUserScroll);
  }, [logBoxRef]);

  useLayoutEffect(() => {
    const logBox = logBoxRef.current;
    if (!logBox) {
      return;
    }

    logBox.scrollTop = isScrolledToBottom
      ? logBox.scrollHeight
      : logBox.scrollTop;
  });

  const handleUserScroll = () => {
    const logBox = logBoxRef.current;
    if (!logBox) {
      return;
    }
    const atBottom =
      logBox.scrollHeight - logBox.scrollTop - logBox.clientHeight < 2;
    setIsScrolledToBottom(atBottom);
  };

  return (
    <BasePage>
      <AbcPredictionUploadDescription />
      <Box sx={{ border: '2px solid black', p: 2 }}>
        <Input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSelectedFile(e.target.files && e.target.files[0])
          }
          inputProps={{
            accept: '.csv,.tsv',
            maxLength: '524288000', // 500 MB
          }}
          sx={{ marginBottom: '16px', display: 'block' }}
        ></Input>
        <FormControlLabel
          control={
            <Checkbox
              value={isTemporaryData}
              defaultChecked
              onChange={(e) => setIsTemporaryData(e.target.checked)}
            />
          }
          label="This is temporary data"
        />
        {!isTemporaryData ? (
          <Box>
            <Typography sx={{ color: 'red', fontWeight: 'bold' }}>
              WARNING: Please be careful when uploading data as final. This is
              permanent and cannot be undone. Please seek approval from site
              administrators before using this option.
            </Typography>
          </Box>
        ) : null}
        <Button onClick={onSubmit} sx={{ display: 'block' }}>
          Submit
        </Button>
      </Box>
      <Box
        ref={logBoxRef}
        style={{
          marginTop: '24px',
          backgroundColor: '#eeeeee',
          height: '500px',
          overflow: 'auto',
        }}
      >
        {dataProgressLogs.map((log) => (
          <Typography sx={{ fontFamily: 'Monospace', margin: 2 }}>
            {log}
          </Typography>
        ))}
      </Box>
    </BasePage>
  );
}

export default UploadPage;
