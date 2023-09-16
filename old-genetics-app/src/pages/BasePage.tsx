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
        name="Variant2Function"
        items={mainMenuItems}
        search={<Search embedded />}
      />
    }
  >
    <Helmet
      defaultTitle="V2F"
      titleTemplate="%s | V2F"
    />
    {children}
  </Page>
);

export default BasePage;
