import { Link as ReactRouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { MenuItem, MenuList, Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ClassNameMap } from '@mui/styles/withStyles';
import classNames from 'classnames';
import {Link} from '../../ot-ui-components';
import OpenTargetsTitle from './OpenTargetsTitle';
import HeaderMenu, { HeaderMenuItem } from './HeaderMenu';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  navbar: {
    backgroundColor: theme.palette.primary.main,
    margin: 0,
    width: '100%',
  },
  navbarHomepage: {
    left: 0,
    top: 0,
    position: 'absolute',
  },
  flex: {
    flexGrow: 1,
  },
  menuExternalLinkContainer: {
    fontSize: '1rem',
    '&:first-of-type': {
      marginLeft: '1rem',
    },
    '&:not(:last-child)': {
      marginRight: '1rem',
    },
  },
  menuExternalLink: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  menuList: {
    display: 'flex',
  },
  menuItem: {
    paddingTop: '6px',
    paddingBottom: '6px',
  },
  menuLink: {
    fontSize: '0.875rem',
    color: '#fff',
    '&:hover': {
      color: '#fff',
    },
  },
}));

type MenuExternalLinkProps = {
  classes: ClassNameMap;
  href: string;
  children: React.ReactNode;
};
const MenuExternalLink = ({
  classes,
  href,
  children,
}: MenuExternalLinkProps) => (
  <Typography color="inherit" className={classes.menuExternalLinkContainer}>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={classes.menuExternalLink}
    >
      {children}
    </a>
  </Typography>
);

type NavBarProps = {
  name: string;
  search?: React.ReactNode;
  api?: string;
  downloads?: string;
  docs?: string;
  contact?: string;
  homepage?: boolean;
  items: HeaderMenuItem[];
  placement?: 'bottom-start' | 'bottom-end' | undefined;
};
const NavBar = ({
  name,
  search,
  api,
  downloads,
  docs,
  contact,
  homepage,
  items,
  placement,
}: NavBarProps) => {
  const smMQ = useMediaQuery('(max-width:800px)');
  const isHomePageRegular = homepage && !smMQ;
  const classes = useStyles();
  return (
    <AppBar
      className={classNames(classes.navbar, {
        [classes.navbarHomepage]: homepage,
      })}
      position="static"
      color="primary"
      elevation={0}
    >
      <Toolbar variant="dense">
        { (
          <Button component={ReactRouterLink} to="/" color="inherit">
            <OpenTargetsTitle name={name} />
          </Button>
        )}
        <div className={classes.flex} />
        {search ? search : null}

        {docs ? (
          <MenuExternalLink classes={classes} href={docs}>
            Docs
          </MenuExternalLink>
        ) : null}

        {api ? (
          <MenuExternalLink classes={classes} href={api}>
            API
          </MenuExternalLink>
        ) : null}

        {downloads ? (
          <MenuExternalLink classes={classes} href={downloads}>
            Downloads
          </MenuExternalLink>
        ) : null}

        {contact ? (
          <MenuExternalLink classes={classes} href={contact}>
            Contact
          </MenuExternalLink>
        ) : null}

        {items && !isHomePageRegular ? (
          <HeaderMenu items={items} placement={placement} />
        ) : null}

        {isHomePageRegular && (
          <MenuList className={classes.menuList}>
            {items.map((item, i) => (
              <MenuItem key={i} dense={true} className={classes.menuItem}>
                <Link
                  external={item.external}
                  to={item.url}
                  className={classes.menuLink}
                >
                  {item.name}
                </Link>
              </MenuItem>
            ))}
          </MenuList>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
