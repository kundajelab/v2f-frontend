import { Theme } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import ModelSchematic from './ModelSchematic';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  hr: {
    marginTop: '1rem',
  },
  flex: {
    flexGrow: 1,
  },
  heading: {
    fontWeight: 400,
  },
}));

type SectionHeadingProps = {
  heading: string;
  subheading: string;
  entities?: string[];
}
const SectionHeading = ({ heading, subheading, entities }: SectionHeadingProps) => {
  const classes = useStyles();
  return (
    <>
      <hr className={classes.hr} />
      <div className={classes.container}>
        <div>
          <Typography className={classes.heading} variant="h6">
            {heading}
          </Typography>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1">{subheading}</Typography>
            </Grid>
          </Grid>
        </div>
        <div className={classes.flex} />
        {entities ? <ModelSchematic entities={entities} /> : null}
      </div>
    </>
  );
};

export default SectionHeading;
