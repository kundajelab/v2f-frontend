import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

const styles = {
  placeholder: {
    position: 'absolute',
    left: 2,
  },
};

const Placeholder = ({ classes, innerProps, children }) => {
  return (
    <Typography
      color="textSecondary"
      className={classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  );
};

export default withStyles(styles)(Placeholder);
