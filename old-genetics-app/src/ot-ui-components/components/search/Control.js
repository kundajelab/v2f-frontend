import TextField from '@mui/material/TextField';
import withStyles from '@mui/styles/withStyles';
import { Component, forwardRef } from 'react';

const styles = {
  input: {
    display: 'flex',
    padding: 0,
  },
};

const InputComponent = forwardRef(({ ...rest }, ref) => (
  <div ref={ref} {...rest} />
));

class Control extends Component {
  render() {
    const { classes, innerRef, innerProps, children, selectProps } = this.props;
    return (
      <TextField
        variant="standard"
        fullWidth
        ref={innerRef}
        InputProps={{
          inputComponent: InputComponent,
          inputProps: {
            className: classes.input,
            children,
            ...innerProps,
          },
        }}
        {...selectProps.textFieldProps}
      />
    );
  }
}

export default withStyles(styles)(Control);
