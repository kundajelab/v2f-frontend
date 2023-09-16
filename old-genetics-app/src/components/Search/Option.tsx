import { Chip } from '@mui/material';
import { commaSeparate } from '../../ot-ui-components';
import {
  SearchQueryGenesFragment,
  SearchQueryStudiesFragment,
  SearchQueryVariantsFragment,
} from '../../__generated__/graphql';
import BaseSearchOption from './BaseSearchOption';

export type OptionDataType =
  | SearchQueryGenesFragment
  | SearchQueryVariantsFragment
  | SearchQueryStudiesFragment;

const GeneOption = ({ data }: { data: SearchQueryGenesFragment }) => {
  if (!data.symbol || !data.start || !data.end) {
    return null;
  }
  return (
    <BaseSearchOption
      heading={data.symbol}
      subheading={`${data.chromosome}:${commaSeparate(
        data.start
      )}-${commaSeparate(data.end)}`}
      extra={data.id}
    />
  );
};

const StudyOption = ({ data }: { data: SearchQueryStudiesFragment }) => {
  const pubYear = data.pubDate ? new Date(data.pubDate).getFullYear() : null;
  return (
    <BaseSearchOption
      heading={data.traitReported}
      subheading={`${data.pubAuthor} (${pubYear})`}
      extra={
        <>
          {data.pubJournal ? <em>{data.pubJournal} </em> : null}N Study:{' '}
          {data.nInitial ? commaSeparate(data.nInitial) : null}
          <span style={{ float: 'right' }}>
            {data.hasSumstats ? (
              <Chip
                style={{
                  height: '16px',
                  fontSize: '0.7rem',
                  marginRight: '16px',
                }}
                color="primary"
                label="summary statistics"
              />
            ) : null}
            {data.numAssocLoci ? (
              <span
                style={{
                  minWidth: '100px',
                  display: 'inline-block',
                  textAlign: 'right',
                }}
              >
                <strong>{data.numAssocLoci} associated loci</strong>
              </span>
            ) : null}
          </span>
        </>
      }
    />
  );
};

const VariantOption = ({ data }: { data: SearchQueryVariantsFragment }) => (
  <BaseSearchOption heading={data.id} subheading={data.rsId ?? ''} />
);

const Option = ({ data }: { data: OptionDataType }) => {
  switch (data.__typename) {
    case 'Gene':
      return <GeneOption data={data} />;
    case 'Study':
      return <StudyOption data={data} />;
    case 'Variant':
      return <VariantOption data={data} />;
    default:
      return null;
  }
};

export default Option;
