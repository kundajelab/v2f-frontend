import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => ({
  page: {
    background: theme.palette.grey['50'],
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    width: '100%',
  },
  gridContainer: {
    margin: 0,
    padding: '24px',
    width: '100%',
    flex: '1 0 auto',
  },
}));

type PageProps = {
  /** The header component */
  header?: React.ReactNode;
  /** The footer component */
  footer?: React.ReactNode;
  /** The children (page content) */
  children?: React.ReactNode;
};
const Page = ({ header, footer, children }: PageProps) => {
  const classes = useStyles();
  return (
    <div className={classes.page}>
      {header}
      <Grid
        container
        justifyContent={'center'}
        spacing={4}
        className={classes.gridContainer}
      >
        <Grid item xs={12} md={11}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default Page;
