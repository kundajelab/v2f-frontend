import { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import classNames from 'classnames';

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    display: 'inline',
  },
  fat: {
    fontWeight: 1100,
    textTransform: 'capitalize',
  },
  thin: {
    fontWeight: 300,
    textTransform: 'capitalize',
  },
}));

type OpenTargetsTitlesProps = {
  className?: string;
  name: string;
};
const OpenTargetsTitle = ({ className, name }: OpenTargetsTitlesProps) => {
  const classes = useStyles();
  const titleClasses = classNames(classes.root, className);
  return (
    <Typography className={titleClasses} variant="h6" color="inherit">
      <span className={classes.thin}>Variant2Gene</span>
    </Typography>
  );
};

export default OpenTargetsTitle;
