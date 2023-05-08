import {
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
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
          'http://localhost:4000/get-data-props',
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
      <Typography variant="h5" style={{ marginBottom: '8px' }}>
        Uploading ABC Predictions
      </Typography>
      <Typography style={{ marginBottom: '8px' }}>
        To upload a set of ABC Predictions, you must prepare a .csv or .tsv file
        containing all information regarding related cell types, genes and
        variants as well in a "tall" format.
      </Typography>
      <Typography style={{ marginBottom: '8px' }}></Typography>
      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        <ListItem sx={{ display: 'list-item' }}>
          If a row does not have a value for some property, please use "NA"
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          The table should contain the following columns:
        </ListItem>
      </List>

      <DataPropTable dataProps={dataProps}></DataPropTable>
    </>
  );
}
