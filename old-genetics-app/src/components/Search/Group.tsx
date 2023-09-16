import { Theme, Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';
import { ReactNode } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  groupHeading: {
    paddingBottom: '.25rem',
  },
  groupHeadingText: {
    padding: '0 .25rem',
    fontSize: '.75rem',
    color: theme.palette.secondary.main,
    borderBottom: `1px solid ${theme.palette.secondary.main}`,
  },
}));

const groupNameMap: { [key: string]: string } = {
  Variant: 'Variants',
  Gene: 'Genes',
  Study: 'Studies',
};

type GroupProps = {
  children: ReactNode;
  name: string;
};
const Group = ({ children, name }: GroupProps) => {
  const classes = useStyles();

  return (
    <div className={classes.groupHeading}>
      {name !== 'any' && (
        <Typography className={classes.groupHeadingText} variant="body1">
          {groupNameMap[name]}
        </Typography>
      )}
      {children}
    </div>
  );
};

export default Group;
