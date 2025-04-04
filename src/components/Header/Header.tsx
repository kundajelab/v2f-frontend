import { Grid, Theme, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Skeleton } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const useStyles = makeStyles((theme: Theme) => ({
  externalLinks: {
    '& > :not(:first-child):before': {
      content: '" | "',
    },
  },
  mainIconContainer: {
    width: '56px',
    textAlign: 'center',
    marginRight: '15px',
  },
  mainIcon: {
    width: '100% !important',
    color: theme.palette.primary.main,
  },
  subtitle: {
    display: 'flex',
    paddingLeft: '5px',
    alignItems: 'center',
  },
  title: {
    fontWeight: 500,
    marginRight: '10px',
  },
  titleContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
}));

type HeaderProps = {
  loading: boolean;
  Icon: IconProp;
  title: string;
  subtitle?: string | null;
  externalLinks?: React.ReactNode;
  children?: React.ReactNode | null;
};
function Header({
  loading,
  Icon,
  title,
  subtitle = null,
  externalLinks,
  children = null,
}: HeaderProps) {
  const classes = useStyles();

  return (
    <Grid
      className={classes.titleContainer}
      container
      id="profile-page-header-block"
      justifyContent="space-between"
      wrap="nowrap"
    >
      <Grid item zeroMinWidth>
        <Grid container wrap="nowrap" alignItems="center">
          <Grid item className={classes.mainIconContainer}>
            <FontAwesomeIcon
              icon={Icon}
              size="4x"
              className={classes.mainIcon}
            />
          </Grid>
          <Grid item zeroMinWidth>
            <Grid container alignItems="baseline">
              <Typography
                className={classes.title}
                color="textSecondary"
                variant="h5"
                title={title}
              >
                {loading ? <Skeleton width="10vw" /> : title}
              </Typography>
              <Typography className={classes.subtitle} variant="body2">
                {loading ? <Skeleton width="25vw" /> : subtitle}
              </Typography>
            </Grid>
            <Grid container>
              <Typography variant="body2" className={classes.externalLinks}>
                {loading ? <Skeleton width="50vw" /> : externalLinks}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>{children}</Grid>
    </Grid>
  );
}

export default Header;
