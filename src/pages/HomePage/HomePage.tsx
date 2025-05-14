import { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Button, Divider, Grid, Theme, Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { Link } from '../../ot-ui-components';
import Search from '../../components/Search';
import NavBar from '../../components/NavBar/NavBar';
import Version from '../../components/Version';
import { Splash } from '../../ot-ui-components';

import HomeBox from './HomeBox';

import { mainMenuItems } from '../../constants';

const EXAMPLES = [
  {
    label: '1_1351747_G_A',
    url: '/variant/1_1351747_G_A',
    type: 'variant-id',
  },
  { label: 'rs4129267', url: '/variant/1_154453788_C_T', type: 'variant-rsid' },
  
];

const BROWSER_EXAMPLES = [
  {
    label: 'ENCODE-rE2G in X# cell types and tissues from ENCODE (Gschwind* et al. 2025)',
    url: '/igv',
  },
  {
    label: 'scE2G in X# cell types from cell lines, blood, and pancreas (Sheth*, Qiu* et al. 2025)',
    url: '/igv',
  },
  {
    label: 'scE2G in X# cell types from the developing heart (Ma*, Conley* et al. 2025)',
    url: '/igv',
  }
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
        <title>Enhancer2Gene</title>
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
            name="Enhancer2Gene"
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
            <Divider style={{ marginTop: '25px', marginBottom: '25px' }}>
              <strong>OR</strong>
            </Divider>
            <Typography
              style={{
                marginTop: '25px',
              }}
              align="center"
            >
              Browse enhancer-gene predictions in <Link to="/igv">IGV</Link>:
            </Typography>
            <Grid
              container
              className={classes.examples}
              justifyContent="space-around"
            >
              {BROWSER_EXAMPLES.map((d, i) => (
                <Typography
                  key={i}
                  style={{ textAlign: 'center' }}
                  className={classes.exampleLink}
                >
                  <Link to={d.url}>{d.label}</Link>
                </Typography>
              ))}
            </Grid>
            <Box style={{border: '1px solid #e0e0e0', borderRadius: '10px', padding: '20px', marginTop: '25px'}}>
            <Typography
              align="center"
            >
              This browser extends <Link to="https://opentargets.org/genetics">OpenTargets Genetics</Link> to include predictions about enhancer-gene regulatory interactions
            </Typography>
              
            <Typography
              style={{
                marginTop: '25px',
              }}
              align="center"
            >
                Note: genomic coordinates are based on GRCh38
              </Typography>
            </Box>
            
          </HomeBox>
        </Grid>
      </main>
    </>
  );
};

export default HomePage;
