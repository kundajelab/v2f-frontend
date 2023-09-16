import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Box, CircularProgress, Input, InputBase } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Autocomplete, Theme } from '@mui/material';
import { Search as SearchIcon, ArrowDropDown } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

import useDebounce from '../../hooks/useDebounce';
import Option, { OptionDataType } from './Option';
import Group from './Group';
import { SearchQueryQuery } from '../../__generated__/graphql';
import { loader } from 'graphql.macro';

const SEARCH_QUERY = loader('../../queries/SearchQuery.gql');

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
  },
  containerEmbedded: {
    minWidth: '447px',
    [theme.breakpoints.only('sm')]: { minWidth: '48%' },
    [theme.breakpoints.only('xs')]: { display: 'none' },
  },
  input: {
    width: '100%',
    paddingRight: '60px',
  },
  inputBase: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
    width: '100%',
  },
  inputBaseInput: { padding: '.25rem .5rem' },
  listbox: { maxHeight: '275px', color: theme.palette.text.primary },
  option: { display: 'block', padding: '0 .5rem' },
  root: {
    width: '100%',
  },
}));

function Search({ autoFocus = false, embedded = false }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [getData, { loading, data }] = useLazyQuery<SearchQueryQuery>(
    SEARCH_QUERY,
    {
      variables: { queryString: debouncedInputValue },
      onCompleted: () => {},
    }
  );
  const [searchResults, setSearchResults] = useState<OptionDataType[]>([]);
  let history = useHistory();

  const handleChangeInputValue = (e: SyntheticEvent) => {
    const typedEvent = e as ChangeEvent<HTMLInputElement>;
    if (!typedEvent.target.value) {
      setOpen(false);
    } else {
      setOpen(true);
    }
    setInputValue(typedEvent.target.value || '');
  };

  const handleSelectOption = (
    e: SyntheticEvent,
    option: OptionDataType | string | null
  ) => {
    handleChangeInputValue(e);

    if (!option || typeof option === 'string') return;

    if (option.__typename === 'Study') {
      history.push(`/study/${option.studyId}`);
    } else if (option.__typename === 'Gene') {
      history.push(`/gene/${option.id}`);
    } else if (option.__typename === 'Variant') {
      history.push(`/variant/${option.id}`);
    }
  };

  const getOptionId = (opt: OptionDataType | string) => {
    if (typeof opt === 'string') {
      return opt;
    } else if ('id' in opt) {
      return opt.id;
    }
    return opt.studyId;
  };

  useEffect(() => {
    if (debouncedInputValue) {
      getData({ variables: { queryString: debouncedInputValue } });
    } else {
      setSearchResults([]);
    }
  }, [debouncedInputValue, getData]);

  useEffect(() => {
    if (data) {
      setSearchResults([
        ...(data.search.genes as OptionDataType[]),
        ...(data.search.variants as OptionDataType[]),
        ...(data.search.studies as OptionDataType[]),
      ]);
    }
  }, [data, inputValue]);

  const classes = useStyles();

  return (
    <Box className={!embedded ? classes.container : classes.containerEmbedded}>
      <Autocomplete
        autoHighlight
        freeSolo
        forcePopupIcon
        disablePortal
        clearOnEscape={false}
        classes={{
          listbox: classes.listbox,
          option: classes.option,
          root: classes.root,
        }}
        filterOptions={(o, s) => searchResults}
        getOptionLabel={(option) => getOptionId(option)}
        isOptionEqualToValue={(option, value) => option === value}
        groupBy={(option) => option.__typename ?? ''}
        loading={loading}
        noOptionsText="No results"
        options={searchResults}
        onChange={handleSelectOption}
        onOpen={() => {
          if (inputValue) setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        popupIcon={open ? <ArrowDropDown /> : <SearchIcon />}
        renderOption={(props, option) => (
          <li {...props}>
            <Option data={option} />
          </li>
        )}
        renderGroup={(group) => (
          <Group key={group.key} name={group.group} children={group.children} />
        )}
        renderInput={(params) =>
          !embedded ? (
            <Input
              className={classes.input}
              inputProps={params.inputProps}
              ref={params.InputProps.ref}
              endAdornment={
                loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  params.InputProps.endAdornment
                )
              }
              placeholder="Search for a gene, variant, study, or trait..."
              onChange={handleChangeInputValue}
              value={inputValue}
            />
          ) : (
            <InputBase
              autoFocus={autoFocus}
              classes={{
                root: classes.inputBase,
                input: classes.inputBaseInput,
              }}
              inputProps={params.inputProps}
              ref={params.InputProps.ref}
              endAdornment={
                loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  params.InputProps.endAdornment
                )
              }
              placeholder="Search..."
              onChange={handleChangeInputValue}
              value={inputValue}
            />
          )
        }
        value={inputValue}
      />
    </Box>
  );
}

export default Search;
