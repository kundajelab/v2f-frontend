import { KeyboardEventHandler, SyntheticEvent } from 'react';
import {
  MenuItem,
  Popper,
  MenuList,
  IconButton,
  Fade,
  Paper,
  ClickAwayListener,
  Theme,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import {Link} from '../../ot-ui-components';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';

const useStyles = makeStyles((_theme: Theme) => ({
  menuBox: {
    zIndex: 1000,
  },
  icon: {
    marginLeft: '20px',
  },
  menuLink: {
    width: '100%',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  menuItem: {
    paddingLeft: '0px',
    paddingRight: '0px',
  },
}));

export type HeaderMenuItem = {
  name: string;
  external?: boolean;
  url: string;
};
type HeaderMenuProps = {
  items: HeaderMenuItem[];
  placement?: 'bottom-start' | 'bottom-end';
};
const HeaderMenu = (props: HeaderMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { items, placement } = props;
  const classes = useStyles();
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuToggle = (event: SyntheticEvent) => {
    setAnchorEl(
      anchorEl === null ? (event.currentTarget as HTMLElement) : null
    );
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleListKeyDown: KeyboardEventHandler<HTMLUListElement> = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setAnchorEl(null);
    }
  };

  return (
    <>
      <IconButton
        className={classes.icon}
        size="medium"
        color="inherit"
        aria-label="open header menu"
        aria-haspopup="true"
        onClick={handleMenuToggle}
      >
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <Popper
        open={isMenuOpen}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
        placement={placement || 'bottom-start'}
        className={classes.menuBox}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList onKeyDown={handleListKeyDown}>
                  {items.map((item, i) => (
                    <MenuItem
                      onClick={handleMenuClose}
                      key={i}
                      dense={true}
                      className={classes.menuItem}
                    >
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
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default HeaderMenu;
