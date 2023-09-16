import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';

import PlotContainerSection from './PlotContainerSection';
import { makeStyles } from '@mui/styles';
import { ApolloError } from '@apollo/client';

const useStyles = makeStyles(() => ({
  plotContainer: {
    marginBottom: '15px',
  },
  leftContainer: {
    marginLeft: '4px',
  },
  rightContainer: {
    marginRight: '4px',
  },
}));

type PlotContainerProps = {
  loading?: boolean;
  error?: ApolloError;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
};
const PlotContainer = ({
  loading,
  error,
  left,
  center,
  right,
  children,
}: PlotContainerProps) => {
  const classes = useStyles();
  return (
    <Paper className={classes.plotContainer} elevation={0}>
      {left || center || right ? (
        <PlotContainerSection>
          <Grid container justifyContent="space-between" spacing={8}>
            <Grid item className={classes.leftContainer}>
              {left}
            </Grid>
            <Grid item>{center}</Grid>
            <Grid item className={classes.rightContainer}>
              {right}
            </Grid>
          </Grid>
        </PlotContainerSection>
      ) : null}
      {loading ? <LinearProgress /> : null}
      {error ? (
        <PlotContainerSection>
          <div>
            <Typography variant="subtitle1" color="error">
              {error.graphQLErrors.map(({ message }, i) => (
                <span key={i}>{message}</span>
              ))}
            </Typography>
          </div>
        </PlotContainerSection>
      ) : null}
      {children}
    </Paper>
  );
};

export default PlotContainer;
