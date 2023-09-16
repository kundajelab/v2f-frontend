import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import Icon from '@mui/material/Icon';
import { MouseEventHandler } from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => ({
  base: {
    fontFamily: 'Inter',
    fontSize: 'inherit',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  baseDefault: {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  baseTooltip: {
    color: 'white',
    '&:hover': {
      color: theme.palette.primary.light,
    },
    textDecoration: 'underline',
  },
  baseFooter: {
    color: 'white',
    '&:hover': {
      color: theme.palette.primary.light,
    },
    display: 'flex',
    alignItems: 'center',
  },
  externalIcon: {
    fontSize: '70%',
    verticalAlign: 'baseline',
    marginLeft: '3px',
    width: 'auto',
    height: 'auto',
    display: 'inline',
  },
}));

type LinkProps = {
  children: React.ReactNode;
  /** The url to visit on clicking the link. */
  to: string;
  /** Whether the link directs to an external site. */
  external?: boolean;
  /** Whether the link is used within the footer section. */
  footer?: boolean;
  /** Whether the link is used within a tooltip. */
  tooltip?: boolean;
  /** The handler to call on click. */
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};
const Link = ({
  children,
  to = '/',
  onClick,
  external = false,
  footer = false,
  tooltip = false,
  className,
}: LinkProps) => {
  const classes = useStyles();
  return external ? (
    <a
      className={classNames(
        classes.base,
        {
          [classes.baseDefault]: !footer && !tooltip,
          [classes.baseFooter]: footer,
          [classes.baseTooltip]: tooltip,
        },
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
      href={to}
      onClick={onClick}
    >
      {children}
      {footer ? null : (
        <Icon
          className={classNames(
            'fa',
            'fa-external-link-alt',
            classes.externalIcon
          )}
        />
      )}
    </a>
  ) : (
    <RouterLink
      className={classNames(
        classes.base,
        {
          [classes.baseDefault]: !footer && !tooltip,
          [classes.baseFooter]: footer,
          [classes.baseTooltip]: tooltip,
        },
        className
      )}
      to={to}
      onClick={onClick}
    >
      {children}
    </RouterLink>
  );
};

export default Link;
