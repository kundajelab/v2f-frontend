import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
});

const NoOptionsMessage = ({ classes, innerProps, children }) => {
  return (
    <Typography
      color="textSecondary"
      className={classes.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  );
};

export default withStyles(styles)(NoOptionsMessage);
