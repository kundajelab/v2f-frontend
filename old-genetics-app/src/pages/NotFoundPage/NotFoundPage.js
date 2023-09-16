import { Typography } from '@mui/material';

import BasePage from '../BasePage';
import EmptyPage from '../EmptyPage';

const NotFoundPage = () => {
  return (
    <BasePage>
      <EmptyPage>
        <Typography>404 Page Not Found</Typography>
      </EmptyPage>
    </BasePage>
  );
};

export default NotFoundPage;
