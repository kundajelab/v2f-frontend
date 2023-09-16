import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Grid, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from '../../ot-ui-components';

const useHelpBoxStyle = makeStyles((theme: Theme) => ({
  baseLink: {
    whiteSpace: 'pre-wrap',
  },
  helpBoxes: {
    maxWidth: '120px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left',
    },
  },
}));

type HelpBoxPanelProps = {
  fai: IconProp;
  url: string;
  label: string;
  external?: boolean;
};
const HelpBoxPanel = ({ fai, url, label, external }: HelpBoxPanelProps) => {
  const theme = useTheme();
  const xsMQ = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useHelpBoxStyle();
  if (xsMQ) {
    // on xsmall screens
    return (
      <Link to={url} external={external} className={classes.baseLink}>
        <Grid container wrap="nowrap" alignItems="center" spacing={1}>
          <Grid item>
            <div className="fa-layers fa-fw fa-3x">
              <FontAwesomeIcon icon={faCircle} />
              <FontAwesomeIcon icon={fai} transform="shrink-8" inverse />
            </div>
          </Grid>
          <Grid item>
            <Typography display="inline">{label}</Typography>
          </Grid>
        </Grid>
      </Link>
    );
  }
  return (
    <Box className={classes.helpBoxes}>
      <Link to={url} external={external} className={classes.baseLink}>
        <div className="fa-layers fa-fw fa-6x">
          <FontAwesomeIcon icon={faCircle} />
          <FontAwesomeIcon icon={fai} transform="shrink-8" inverse />
        </div>
        <Typography>{label}</Typography>
      </Link>
    </Box>
  );
};

export default HelpBoxPanel;