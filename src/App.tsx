import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { OtUiThemeProvider } from './ot-ui-components';
import { CompatRouter, CompatRoute } from 'react-router-dom-v5-compat';

import client from './client';
import HomePage from './pages/HomePage/index';
import StudyPage from './pages/StudyPage';
import StudiesPage from './pages/StudiesPage';
import GenePage from './pages/GenePage';
import VariantPage from './pages/VariantPage';
import LocusPage from './pages/LocusPage';
import StudyLocusPage from './pages/StudyLocusPage';
import ImmunobasePage from './pages/ImmunobasePage';
import { socket, SocketContext } from './socket';
import UploadPage from './pages/UploadPage';

const App = () => (
  <ApolloProvider client={client}>
    <SocketContext.Provider value={socket}>
      <OtUiThemeProvider>
        <Router>
          <CompatRouter>
            <Switch>
              <CompatRoute exact path="/" component={HomePage} />
              <CompatRoute path="/study/:studyId" component={StudyPage} />
              <CompatRoute
                path="/study-comparison/:studyId"
                component={StudiesPage}
              />
              <CompatRoute path="/gene/:geneId" component={GenePage} />
              <CompatRoute path="/variant/:variantId" component={VariantPage} />
              <CompatRoute path="/locus" component={LocusPage} />
              <CompatRoute
                path="/study-locus/:studyId/:indexVariantId"
                component={StudyLocusPage}
              />
              <CompatRoute path="/immunobase" component={ImmunobasePage} />
              <CompatRoute path="/upload" component={UploadPage} />
            </Switch>
          </CompatRouter>
        </Router>
      </OtUiThemeProvider>
    </SocketContext.Provider>
  </ApolloProvider>
);

export default App;
