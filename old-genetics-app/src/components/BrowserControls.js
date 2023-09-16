import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
  selectContainer: {
    paddingLeft: '4px',
    paddingRight: '4px',
  },
});

const BrowserControls = ({
  classes,
  handlePanLeft,
  handlePanRight,
  handleZoomIn,
  handleZoomOut,
  displayTypeValue,
  displayTypeOptions,
  displayFinemappingValue,
  displayFinemappingOptions,
  handleDisplayTypeChange,
  handleDisplayFinemappingChange,
  disabledZoomOut = false,
}) => (
  <Grid container alignItems="center">
    <Grid item>
      <IconButton onClick={handlePanLeft} size="large">
        <KeyboardArrowLeft />
      </IconButton>
    </Grid>
    <Grid item>
      <IconButton onClick={handlePanRight} size="large">
        <KeyboardArrowRight />
      </IconButton>
    </Grid>
    <Grid item>
      <IconButton onClick={handleZoomIn} size="large">
        <Add />
      </IconButton>
    </Grid>
    <Grid item>
      <IconButton
        onClick={handleZoomOut}
        disabled={disabledZoomOut}
        size="large"
      >
        <Remove />
      </IconButton>
    </Grid>
    <Grid item>
      <div className={classes.selectContainer}>
        <Select
          variant="standard"
          value={displayTypeValue}
          onChange={handleDisplayTypeChange}
        >
          {displayTypeOptions.map((d) => (
            <MenuItem key={d.value} value={d.value}>
              {d.label}
            </MenuItem>
          ))}
        </Select>
      </div>
    </Grid>
    <Grid item>
      <div className={classes.selectContainer}>
        <Select
          variant="standard"
          value={displayFinemappingValue}
          onChange={handleDisplayFinemappingChange}
        >
          {displayFinemappingOptions.map((d) => (
            <MenuItem key={d.value} value={d.value}>
              {d.label}
            </MenuItem>
          ))}
        </Select>
      </div>
    </Grid>
  </Grid>
);

export default withStyles(styles)(BrowserControls);
