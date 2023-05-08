import { Box, Button, Input, Typography } from '@mui/material';
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

      console.log(response.data);
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
      <Input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSelectedFile(e.target.files && e.target.files[0])
        }
      ></Input>
      <Button onClick={onSubmit}>Submit</Button>
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
