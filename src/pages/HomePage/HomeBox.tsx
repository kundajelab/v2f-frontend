import { Grid, Paper, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  homeboxContainer: {
    overflow: 'visible',
    padding: '30px 60px',
    maxWidth: '800px',
    margin: 'auto',
  },
  homeboxHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    color: theme.palette.grey[700],
    bottom: '40px',
    fontSize: '30px',
    marginLeft: '7px',
    position: 'relative',
  },
  logo: {
    maxWidth: '30rem',
    width: '100%',
  },
  note: {
    backgroundColor: '#ffffcc',
    textAlign: 'center',
    padding: '15px 74px',
  },
  important: {
    marginBottom: '10px',
  },
}));

type HomeBoxProps = {
  children: React.ReactNode;
};
const HomeBox = ({ children }: HomeBoxProps) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={8} md={8} lg={8}>
      <Paper className={classes.homeboxContainer}>
        <div className={classes.homeboxHeader}>
        </div>
        {children}
      </Paper>
    </Grid>
  );
};

export default HomeBox;
