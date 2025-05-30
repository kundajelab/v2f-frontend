import { lighten, darken } from 'polished';

const PRIMARY = '#8C1515'; // '#7b196a'; // '#0091eb';
const SECONDARY = '#175E54';

const GENE = PRIMARY;
const VARIANT = PRIMARY;
const STUDY = PRIMARY;

const theme = {
  shape: {
    borderRadius: 0,
  },
  typography: {
    useNextVariants: true,
    fontFamily: '"Inter", "serif"',
  },
  palette: {
    primary: {
      light: lighten(0.2, PRIMARY),
      main: PRIMARY,
      dark: darken(0.2, PRIMARY),
      contrastText: '#fff',
    },
    secondary: {
      light: lighten(0.2, SECONDARY),
      main: SECONDARY,
      dark: darken(0.2, SECONDARY),
      contrastText: '#fff',
    },
    text: {
      primary: '#5A5F5F',
    },
    gene: GENE,
    tagVariant: VARIANT,
    indexVariant: VARIANT,
    study: STUDY,
    high: darken(0.2, PRIMARY),
    medium: PRIMARY,
    low: lighten(0.2, PRIMARY),
    footer: '#2e2d35',
  },
  sectionPadding: '8px',
  widgetHeight: '250px',
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        padding: '4px 56px 4px 24px',
        fontSize: '0.8rem',
      },
      head: {
        fontSize: '0.75rem',
        lineHeight: '1.2',
        color: 'rgba(0, 0, 0, 0.54)',
      },
    },
    MuiTableRow: {
      head: {
        height: '56px',
      },
    },
    MuiButton: {
      root: {
        borderRadius: 0,
        border: 0,
        padding: '6px 12px',
        minWidth: '32px',
        minHeight: '32px',
        height: '32px',
        textTransform: 'none',
      },
    },
    MuiCard: {
      root: {
        border: `1px solid #ddd`,
      },
    },
    MuiIconButton: {
      root: {
        width: '32px',
        height: '32px',
        padding: '0px',
      },
    },
    MuiTablePagination: {
      root: {
        height: '36px',
        minHeight: '36px',
      },
      toolbar: {
        height: '36px',
        minHeight: '36px',
      },
    },
    MuiTabs: {
      root: {
        borderBottom: '1px solid #616161',
        color: '#000000',
      },
      indicator: {
        display: 'none',
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        minWidth: '10px !important',
        '&$selected': {
          backgroundColor: PRIMARY,
          color: 'white',
          '&:hover': { backgroundColor: PRIMARY },
        },
        '&:hover': { backgroundColor: lighten(0.3, PRIMARY) },
      },
    },
    MuiTypography: {
      // colorSecondary: {
      //   color: '#E2DFDF',
      // },
      colorError: {
        color: SECONDARY,
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        padding: 0,
        paddingRight: '32px',
        minHeight: 0,
        '&$expanded': {
          minHeight: 0,
          margin: 0,
        },
      },
      content: {
        width: '100%',
        margin: 0,
        '&$expanded': {
          margin: 0,
        },
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: 0,
        paddingRight: '32px',
      },
    },
    MuiLinearProgress: {
      root: {
        height: '1px',
      },
    },
  },
};

export default theme;
