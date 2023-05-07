import { Box, Button, Input, Typography } from '@mui/material';
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SocketContext } from '../../socket';

import axios from 'axios';

import BasePage from '../BasePage';

function UploadPage() {
  const socket = useContext(SocketContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataProgressLogs, setDataProgressLogs] = useState<string[]>([]);

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

  return (
    <BasePage>
      <Input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSelectedFile(e.target.files && e.target.files[0])
        }
      ></Input>
      <Button onClick={onSubmit}>Submit</Button>
      <Box
        style={{
          marginTop: '24px',
          backgroundColor: '#eeeeee',
          padding: '16px',
          height: '500px',
          overflow: 'scroll',
        }}
      >
        {dataProgressLogs.map((log) => (
          <Typography sx={{ fontFamily: 'Monospace' }}>{log}</Typography>
        ))}
      </Box>
    </BasePage>
  );
}

export default UploadPage;
