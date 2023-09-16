import withStyles from '@mui/styles/withStyles';
import MuiChip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';

const styles = (theme) => ({
  miniChip: {
    color: 'white',
    backgroundColor: (props) =>
      props.data.chipcolor ? props.data.chipcolor : theme.palette.primary.main,
    margin: '1px',
    height: '20px',
    fontSize: '0.7rem',
  },
  deleteIcon: {
    fontSize: '16px',
  },
});

const Chip = ({ classes, children, selectProps, removeProps, data }) => {
  return (
    <MuiChip
      key={selectProps.getOptionValue(data)}
      className={classes.miniChip}
      tabIndex={-1}
      label={children}
      onDelete={removeProps.onClick}
      deleteIcon={
        <CancelIcon className={classes.deleteIcon} {...removeProps} />
      }
    />
  );
};

export default withStyles(styles)(Chip);
