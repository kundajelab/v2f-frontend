import { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Theme, Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { Link } from '../../ot-ui-components';
import Search from '../../components/Search';
import NavBar from '../../components/NavBar/NavBar';
import Version from '../../components/Version';
import { Splash } from '../../ot-ui-components';

import HomeBox from './HomeBox';

import { mainMenuItems } from '../../constants';

const EXAMPLES = [
  { label: 'PCSK9', url: '/gene/ENSG00000169174', type: 'gene' },
  {
    label: '1_1351747_G_A',
    url: '/variant/1_1351747_G_A',
    type: 'variant-id',
  },
  { label: 'rs4129267', url: '/variant/1_154453788_C_T', type: 'variant-rsid' },
  {
    label: 'LDL cholesterol (Willer CJ et al. 2013)',
    url: '/study/GCST002222',
    type: 'study',
  },
];

const useStyles = makeStyles((theme: Theme) => {
  return {
    searchSection: {
      position: 'relative',
      height: '100vh',
      overflow: 'visible',
    },
    examples: {
      marginTop: '12px',
    },
    exampleLink: {
      marginTop: '12px',
    },
    scrollDown: {
      position: 'absolute',
      bottom: '10px',
    },
    linkHeader: {
      marginTop: '22px',
    },
    scrollDownContainer: {
      position: 'absolute',
      bottom: 0,
    },
    hpSection: {
      marginBottom: '40px',
      marginTop: '80px',
    },
    linksContainer: {
      marginTop: '15px',
      marginBottom: '15px',
    },
    homeSection: {
      marginBottom: '40px',
    },
  };
});

const HomePage = () => {
  const searchSectionRef = useRef<HTMLElement | null>(null);
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Variant2Function</title>
      </Helmet>
      <main ref={searchSectionRef}>
        <Grid
          className={classes.searchSection}
          container
          justifyContent="center"
          alignItems="center"
        >
          <Splash />
          <NavBar
            name="Variant2Function"
            items={mainMenuItems}
            search={null}
            homepage
          />
          <HomeBox>
            <Search />
            <Grid
              container
              className={classes.examples}
              justifyContent="space-around"
            >
              {EXAMPLES.map((d, i) => (
                <Typography
                  key={i}
                  style={{ textAlign: 'center' }}
                  className={classes.exampleLink}
                >
                  <Link to={d.url}>{d.label}</Link>
                </Typography>
              ))}
            </Grid>
            <Typography
              style={{
                marginTop: '25px',
              }}
              align="center"
            >
              Note: genomic coordinates are based on GRCh38
            </Typography>

            <Typography
              className={classes.linkHeader}
              variant="subtitle2"
              align="center"
            >
              Last updated:
            </Typography>
            <Version />
          </HomeBox>
        </Grid>
      </main>
    </>
  );
};

export default HomePage;
