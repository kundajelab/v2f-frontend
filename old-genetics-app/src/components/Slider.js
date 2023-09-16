import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import MuiSlider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';

const styles = {
  root: {
    width: 200,
    padding: '0 20px',
  },
  sliderContainer: {
    padding: '10px 5px 8px 5px',
  },
  min: {
    fontSize: '0.7rem',
  },
  max: {
    fontSize: '0.7rem',
  },
};

const Slider = ({ classes, label, value, min, max, step, onChange }) => {
  return (
    <div className={classes.root}>
      <Typography>{label}</Typography>
      <div className={classes.sliderContainer}>
        <MuiSlider
          classes={{ container: classes.slider }}
          {...{ value, min, max, step, onChange }}
        />
      </div>

      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography className={classes.min}>{min}</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.max}>{max}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(Slider);
