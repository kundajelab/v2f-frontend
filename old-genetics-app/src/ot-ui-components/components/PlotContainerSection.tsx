import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
  plotContainerSection: {
    padding: '4px 0',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
}));

type PlotContainerSectionProps = {
  children: React.ReactNode;
};
const PlotContainerSection = ({ children }: PlotContainerSectionProps) => (
  <div className={useStyles().plotContainerSection}>{children}</div>
);

export default PlotContainerSection;
