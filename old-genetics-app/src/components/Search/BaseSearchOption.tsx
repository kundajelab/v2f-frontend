import { ClassNameMap, Theme } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import withStyles, { Styles } from '@mui/styles/withStyles';

const styles: Styles<Theme, {}> = (theme: Theme) => ({
  heading: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  subheading: {
    color: theme.palette.grey[800],
    fontSize: '0.75rem',
  },
  extra: {
    color: theme.palette.grey[600],
    fontSize: '0.65rem',
  },
  proportionContainer: {
    width: '100%',
  },
  proportion: {
    height: '2px',
    float: 'left',
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
  },
  proportionRemainder: {
    height: '2px',
    borderBottom: `2px solid ${theme.palette.grey[100]}`,
    width: '100%',
  },
  count: {
    float: 'right',
  },
});

type BaseSearchOptionProps = {
  classes: ClassNameMap;
  heading: string;
  subheading: string;
  extra?: string | JSX.Element;
  count?: number;
  proportion?: number;
};
const BaseSearchOption = ({
  classes,
  heading,
  subheading,
  extra,
  count,
  proportion,
}: BaseSearchOptionProps) => (
  <Grid container>
    <Grid item xs={12}>
      <Typography variant="body1">
        <span className={classes.heading}>{heading}</span>
        {'  '}
        <span className={classes.subheading}>{subheading}</span>
        {count ? <span className={classes.count}>{count}</span> : null}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" className={classes.extra}>
        {extra}
      </Typography>
      {proportion ? (
        <div className={classes.proportionContainer}>
          <div
            className={classes.proportion}
            style={{ width: `${proportion * 100}%` }}
          />
          <div className={classes.proportionRemainder} />
        </div>
      ) : null}
    </Grid>
  </Grid>
);

export default withStyles(styles)(BaseSearchOption);
