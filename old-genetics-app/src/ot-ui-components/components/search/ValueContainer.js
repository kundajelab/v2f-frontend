import withStyles from '@mui/styles/withStyles';

const styles = {
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
  },
};

const ValueContainer = ({ classes, children }) => {
  return <div className={classes.valueContainer}>{children}</div>;
};

export default withStyles(styles)(ValueContainer);
