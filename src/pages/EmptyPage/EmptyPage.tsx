import { Grid, Theme, Typography } from '@mui/material';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Search from '../../components/Search';
import { makeStyles } from '@mui/styles';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    color: theme.palette.primary.main,
    marginBottom: '12px',
  },
  actionText: {
    width: '150px',
  },
  suggestions: {
    width: '450px',
    marginBottom: '42px',
  },
  message: {
    marginBottom: '24px',
  },
}));

type EmptyPageProps = {
  children: React.ReactNode;
};
const EmptyPage = ({ children }: EmptyPageProps) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" alignItems="center">
      <FontAwesomeIcon
        icon={faExclamationTriangle as IconProp}
        size="3x"
        className={classes.icon}
      />
      <Typography variant="h5">Sorry</Typography>
      <div className={classes.message}>{children}</div>
      <Search />
    </Grid>
  );
};

export default EmptyPage;
