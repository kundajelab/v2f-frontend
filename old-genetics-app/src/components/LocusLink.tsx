import queryString from 'query-string';

import { Link, Button, LocusIcon } from '../ot-ui-components';
import {
  chromosomesWithCumulativeLengths,
  ChromosomeWithCumulativeLength,
} from '../utils';
import { makeStyles } from '@mui/styles';

type ChromosomeDict = {
  [chromosomeName: string]: ChromosomeWithCumulativeLength;
};
const chromosomeDict = chromosomesWithCumulativeLengths.reduce((acc, d) => {
  acc[d.name] = d;
  return acc;
}, {} as ChromosomeDict);

const mb = 1000000;

const useStyles = makeStyles(() => ({
  button: {
    lineHeight: 1,
    minWidth: '110px',
  },
  buttonBig: {
    fontSize: '1.1rem',
    minWidth: '150px',
    width: '150px',
    height: '40px',
    paddingLeft: '15px',
  },
  icon: {
    fill: 'white',
    width: '20px',
    height: '20px',
    marginTop: '-5px',
    marginBottom: '-5px',
    marginLeft: '5px',
  },
  iconBig: {
    fill: 'white',
    width: '30px',
    height: '30px',
  },
  link: {
    textDecoration: 'none',
  },
}));

type LocusLinkProps = {
  big?: boolean;
  chromosome: string | null;
  position: number;
  selectedGenes?: string[];
  selectedTagVariants?: string[];
  selectedIndexVariants?: string[];
  selectedStudies?: string[];
};
const LocusLink = ({
  big,
  chromosome,
  position,
  selectedGenes,
  selectedTagVariants,
  selectedIndexVariants,
  selectedStudies,
}: LocusLinkProps) => {
  const classes = useStyles();
  if (chromosome === null) return null;
  const chromosomeObj = chromosomeDict[chromosome];
  const start = position > mb ? position - mb : 0;
  const end =
    position <= chromosomeObj.length - mb
      ? position + mb
      : chromosomeObj.length - 1;
  // TODO: type when LocusPage is typed
  const params: { [key: string]: any } = { chromosome, start, end };
  if (selectedGenes) {
    params.selectedGenes = selectedGenes;
  }
  if (selectedTagVariants) {
    params.selectedTagVariants = selectedTagVariants;
  }
  if (selectedIndexVariants) {
    params.selectedIndexVariants = selectedIndexVariants;
  }
  if (selectedStudies) {
    params.selectedStudies = selectedStudies;
  }
  return (
    <Link
      to={`/locus?${queryString.stringify(params)}`}
      className={classes.link}
    >
      <Button className={big ? classes.buttonBig : classes.button}>
        Locus Plot
        <LocusIcon className={big ? classes.iconBig : classes.icon} />
      </Button>
    </Link>
  );
};

export default LocusLink;
