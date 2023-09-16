import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

const styles = {
  singleValue: {
    fontSize: 16,
  },
};

const SingleValue = ({ classes, innerProps, children }) => {
  return (
    <Typography className={classes.singleValue} {...innerProps}>
      {children}
    </Typography>
  );
};

export default withStyles(styles)(SingleValue);
