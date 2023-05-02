import { Helmet } from 'react-helmet';

import { Page } from '../ot-ui-components';

import Search from '../components/Search';
import NavBar from '../components/NavBar/NavBar';
import { mainMenuItems } from '../constants';

type BasePageProps = {
  children: React.ReactNode;
};
const BasePage = ({ children }: BasePageProps) => (
  <Page
    header={
      <NavBar
        name="Genetics"
        items={mainMenuItems}
        search={<Search embedded />}
      />
    }
  >
    <Helmet
      defaultTitle="V2G"
      titleTemplate="%s | V2G"
    />
    {children}
  </Page>
);

export default BasePage;
