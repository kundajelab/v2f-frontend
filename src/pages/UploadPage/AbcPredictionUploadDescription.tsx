import { List, ListItem, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getApiUrl } from '../../env';
import { DataProp } from './data-props';
import { DataPropTable } from './DataPropTable';

enum DataType {
  ABC_PREDICTION = 'abc-prediction',
}

export function AbcPredictionUploadDescription() {
  const [dataProps, setDataProps] = useState<DataProp[]>([]);

  useEffect(() => {
    const fn = async () => {
      try {
        const response = await axios.post(
          `${getApiUrl()}/get-data-props`,
          {
            dataType: DataType.ABC_PREDICTION,
          }
        );
        setDataProps(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };
    fn();
  }, []);

  return (
    <>
      <Typography variant="h6" style={{ marginBottom: '8px' }}>
        Data Upload Guidelines
      </Typography>
      <Typography style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        Please read the following section carefully to understand how your data
        is handled.
      </Typography>
      <Typography style={{ marginBottom: '8px' }}>
        Your uploaded data will be visible to all users. You can choose to
        submit your data as a temporary upload, which will be visible to all
        users for approximately 24 hours. If your data is final, you can submit
        it permanently with site administrator approval. Please be cautious when using this option, and use the
        temporary upload first to ensure your data contains correct values, as
        this cannot be changed later.
      </Typography>
      <Typography style={{ marginBottom: '8px' }}>
        Please contact Riya Sinha (riyasinh@stanford.edu) with any questions.
      </Typography>
      <Typography
        variant="h6"
        style={{ marginTop: '16px', marginBottom: '8px' }}
      >
        ABC Prediction Data Description
      </Typography>
      <Typography style={{ marginBottom: '8px' }}>
        To upload a set of ABC Predictions, you must prepare data according to
        the following specifications:
      </Typography>
      <Typography style={{ marginBottom: '8px' }}></Typography>
      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        <ListItem sx={{ display: 'list-item' }}>
          The file must be a .csv or .tsv file
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          If a row does not have a value for some property, please use "NA"
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          The table should contain the following columns in a "tall" format:
        </ListItem>
      </List>

      <DataPropTable dataProps={dataProps}></DataPropTable>
    </>
  );
}
