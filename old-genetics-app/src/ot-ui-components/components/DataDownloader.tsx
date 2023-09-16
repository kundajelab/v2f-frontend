import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import downloadTable, {
  DownloadFormat,
  HeaderMap,
  TableRow,
} from '../helpers/downloadTable';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  container: {
    marginBottom: '2px',
  },
  downloadHeader: {
    marginTop: '7px',
  },
}));

type DataDownloaderProps = {
  tableHeaders: HeaderMap;
  rows: TableRow[];
  fileStem: string;
};
const DataDownloader = ({
  tableHeaders,
  rows,
  fileStem,
}: DataDownloaderProps) => {
  const classes = useStyles();
  const handleDownload = (
    headers: HeaderMap,
    rows: TableRow[],
    fileStem: string,
    format: DownloadFormat
  ) => {
    downloadTable({
      headerMap: headers,
      rows,
      format,
      filenameStem: fileStem,
    });
  };

  return (
    <Grid
      container
      justifyContent="flex-end"
      spacing={1}
      className={classes.container}
    >
      <Grid item>
        <Typography variant="caption" className={classes.downloadHeader}>
          Download table as
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => handleDownload(tableHeaders, rows, fileStem, 'json')}
        >
          JSON
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => handleDownload(tableHeaders, rows, fileStem, 'csv')}
        >
          CSV
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => handleDownload(tableHeaders, rows, fileStem, 'tsv')}
        >
          TSV
        </Button>
      </Grid>
    </Grid>
  );
};

export default DataDownloader;
