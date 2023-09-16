import SearchIcon from '@mui/icons-material/Search';

const DropdownIndicator = ({ inputRef, innerProps }) => {
  return <SearchIcon ref={inputRef} {...innerProps} color="inherit" />;
};

export default DropdownIndicator;
