import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import withStyles from '@mui/styles/withStyles';

import { Link } from '../ot-ui-components';
import EmailLink from './EmailLink';

const styles = (theme) => ({
  footer: {
    backgroundColor: theme.palette.footer,
    color: '#fff',
    margin: 0,
    width: '100%',
    padding: 24,
  },
});

const linkStyles = () => ({
  iconClass: {
    marginRight: '10px',
  },
  linkContainer: {
    marginBottom: '8px',
  },
});

let FooterLink = ({ label, url, classes, iconClasses }) => (
  <Grid item xs={12} className={classes.linkContainer}>
    <Typography color="inherit">
      {url.startsWith('mailto') ? (
        <EmailLink href={url} label={label} iconClasses={iconClasses} />
      ) : (
        <Link external footer to={url}>
          {iconClasses && (
            <Icon className={iconClasses + ' ' + classes.iconClass} />
          )}
          {label}
        </Link>
      )}
    </Typography>
  </Grid>
);

FooterLink = withStyles(linkStyles)(FooterLink);

const FooterSectionHeading = ({ children }) => (
  <Grid item xs={12}>
    <Typography variant="h6" color="inherit">
      {children}
    </Typography>
  </Grid>
);

const socialLinkStyle = () => ({
  iconsContainer: {
    maxWidth: '235px',
  },
  socialIcon: {
    fontSize: '30px',
    color: 'white',
  },
});

let FooterSocial = ({ social, classes }) => (
  <Fragment>
    <FooterSectionHeading>Follow us</FooterSectionHeading>
    <Grid
      className={classes.iconsContainer}
      container
      justifyContent="space-between"
    >
      {social.map(({ iconClasses, url }, i) => (
        <Grid item key={i}>
          <Link external footer to={url}>
            <Icon className={iconClasses + ' ' + classes.socialIcon} />
          </Link>
        </Grid>
      ))}
    </Grid>
  </Fragment>
);

FooterSocial = withStyles(socialLinkStyle)(FooterSocial);

const FooterSection = ({ heading, links, social }) => (
  <Grid
    item
    xs={12}
    sm={6}
    md={3}
    container
    direction="column"
    justifyContent="space-between"
  >
    <Grid item>
      <FooterSectionHeading>{heading}</FooterSectionHeading>
      {links.map((link, i) => (
        <FooterLink
          key={i}
          label={link.label}
          url={link.url}
          iconClasses={link.iconClasses}
        />
      ))}
    </Grid>

    {social ? (
      <Grid item>
        <FooterSocial social={social} />
      </Grid>
    ) : null}
  </Grid>
);

const Footer = ({ classes, externalLinks }) => (
  <Grid
    className={classes.footer}
    container
    justifyContent="center"
    spacing={4}
  >
    <Grid item container xs={12} md={10} spacing={2}>
      <FooterSection heading="About" links={externalLinks.about} />
      <FooterSection
        heading="Help"
        links={externalLinks.help}
        social={externalLinks.social}
      />
      <FooterSection heading="Partners" links={externalLinks.partners} />
      <FooterSection heading="Open Targets" links={externalLinks.network} />
    </Grid>
  </Grid>
);

export default withStyles(styles)(Footer);
