import Select from 'react-select';
import classNames from 'classnames';
import withStyles from '@mui/styles/withStyles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Component, forwardRef } from 'react';

import Placeholder from './Placeholder';
import NoOptionsMessage from './NoOptionsMessage';
import SingleValue from './SingleValue';
import ValueContainer from './ValueContainer';
import Menu from './MenuFilter';
import MultiValue from './MultiValue';
import OptionFilter from './OptionFilter';

const styles = (theme) => ({
  root: {
    position: 'relative',
    minWidth: '70px',
  },
  wide: {
    minWidth: '300px',
  },
});

const IndicatorSeparator = () => null;

const ClearIndicator = () => null;

const OptionContainer = (props) => {
  const { children, innerRef, innerProps, isFocused, isSelected } = props;
  return (
    <MenuItem
      buttonRef={innerRef}
      selected={isFocused}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
        maxWidth: '800px',
        padding: 0,
        height: 'auto',
      }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  );
};

const InputComponent = forwardRef(({ ...rest }, ref) => (
  <div ref={ref} {...rest} />
));

function Control(props) {
  return (
    <TextField
      variant="standard"
      fullWidth
      InputProps={{
        inputComponent: InputComponent,
        ref: props.innerRef,
        inputProps: {
          style: { display: 'flex', backgroundColor: '#eee' },
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

class Autocomplete extends Component {
  state = {
    value: null,
  };
  handleChange = (value) => {
    this.setState({ value });
  };
  render() {
    const {
      classes,
      theme,
      placeholder,
      options,
      multiple,
      value,
      handleSelectOption,
      getOptionLabel,
      getOptionValue,
      OptionComponent,
      wide,
    } = this.props;

    const selectStyles = {
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
      }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    const Option = ({ data, children, isSelected, ...rest }) => {
      return (
        <OptionContainer {...rest}>
          {OptionComponent ? (
            <OptionComponent data={data}>{children}</OptionComponent>
          ) : (
            <OptionFilter data={data}>{children}</OptionFilter>
          )}
        </OptionContainer>
      );
    };

    const components = {
      Control,
      NoOptionsMessage,
      Placeholder,
      SingleValue,
      ValueContainer,
      Menu,
      Option,
      MultiValue,
      IndicatorSeparator,
      ClearIndicator,
    };

    return (
      <div className={classNames(classes.root, { [classes.wide]: wide })}>
        <Select
          options={options}
          styles={selectStyles}
          components={components}
          value={value}
          onChange={handleSelectOption}
          placeholder={placeholder}
          isMulti={multiple}
          hideSelectedOptions={false}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          menuPortalTarget={document.body}
          menuPlacement="auto"
          menuPosition="absolute"
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Autocomplete);
