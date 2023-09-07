import { Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getApiUrl } from '../../env';
import { DataProp, DataType } from './data-props';
import { DataPropTable } from './DataPropTable';

export function EnhancerGenePredictionUploadDescription() {
  const [dataProps, setDataProps] = useState<DataProp[]>([]);

  useEffect(() => {
    const fn = async () => {
      try {
        const response = await axios.post(`${getApiUrl()}/get-data-props`, {
          dataType: DataType.ENHANCER_GENE_PREDICTION,
        });
        setDataProps(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };
    fn();
  }, []);

  return (
    <>
      <Typography
        variant="h6"
        style={{ marginTop: '16px', marginBottom: '8px' }}
      >
        Enhancer-Gene Prediction Data Description
      </Typography>
      <DataPropTable dataProps={dataProps}></DataPropTable>
    </>
  );
}
