import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
  adaptV4Theme,
} from '@mui/material/styles';
import { Component } from 'react';

import defaultTheme from '../theme';
import setupIcons from '../icons/setupIcons';

class OtUiThemeProvider extends Component {
  componentDidMount() {
    setupIcons();
  }
  render() {
    const { children, theme = defaultTheme } = this.props;
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={createTheme(adaptV4Theme(theme))}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default OtUiThemeProvider;
