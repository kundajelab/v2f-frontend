import Paper from '@mui/material/Paper';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing.unit,
    position: 'absolute',
    minWidth: '100px',
    maxWidth: '800px',
    zIndex: 1005,
  },
});

const Menu = ({ classes, innerProps, children }) => (
  <Paper square className={classes.paper} {...innerProps}>
    {children}
  </Paper>
);

export default withStyles(styles)(Menu);
