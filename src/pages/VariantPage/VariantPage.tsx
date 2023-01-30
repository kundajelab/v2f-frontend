import Helmet from 'react-helmet';
import { loader } from 'graphql.macro';
import queryString, { ParsedQuery } from 'query-string';
import { useQuery } from '@apollo/client';

import { SectionHeading, Typography } from '../../ot-ui-components';
import { PlotContainer } from '../../ot-ui-components';

import BasePage from '../BasePage';
import AssociatedTagVariantsTable from '../../components/AssociatedTagVariantsTable';
import AssociatedIndexVariantsTable from '../../components/AssociatedIndexVariantsTable';
import AssociatedGenes from '../../components/AssociatedGenes';
import ScrollToTop from '../../components/ScrollToTop';
import PheWASSection from '../../components/PheWASSection';

import NotFoundPage from '../NotFoundPage';
import Header from './Header';
import Summary from '../../sections/variant/Summary';

import {
  variantHasAssociatedTagVariants,
  variantHasAssociatedIndexVariants,
  variantHasAssociatedGenes,
  variantTransformAssociatedIndexVariants,
  variantTransformAssociatedTagVariants,
  variantParseGenesForVariantSchema,
} from '../../utils';
import {
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom-v5-compat';

const VARIANT_PAGE_QUERY = loader('../../queries/VariantPageQuery.gql');
const VARIANT_HEADER_QUERY = loader('./VariantHeader.gql');

// TODO: Update when PHEWAS is typed
type PhewasOption = {
  value: string;
};
const VariantPage = () => {
  // Router State
  const navigate = useNavigate();
  const location = useLocation();
  const { variantId } = useParams<{ variantId: string }>();

  // Queries
  const { loading: headerLoading, data: headerData } = useQuery(
    VARIANT_HEADER_QUERY,
    {
      variables: { variantId },
    }
  );
  const {
    loading: pageLoading,
    error,
    data: pageData,
  } = useQuery(VARIANT_PAGE_QUERY, {
    variables: { variantId },
  });

  // Derived State
  const isGeneVariant = variantHasAssociatedGenes(pageData);
  const isTagVariant = variantHasAssociatedIndexVariants(pageData);
  const isIndexVariant = variantHasAssociatedTagVariants(pageData);
  const associatedIndexVariants = isTagVariant
    ? variantTransformAssociatedIndexVariants(pageData)
    : [];
  const associatedTagVariants = isIndexVariant
    ? variantTransformAssociatedTagVariants(pageData)
    : [];

  const genesForVariantSchema = isGeneVariant
    ? variantParseGenesForVariantSchema(pageData)
    : [];

  // Methods
  const handlePhewasTraitFilter = (
    newPhewasTraitFilterValue?: PhewasOption[]
  ) => {
    const { phewasTraitFilter, ...rest } = _parseQueryProps();
    const newQueryParams = {
      ...rest,
    };
    if (newPhewasTraitFilterValue && newPhewasTraitFilterValue.length > 0) {
      newQueryParams.phewasTraitFilter = newPhewasTraitFilterValue.map(
        (d) => d.value
      );
    }
    _stringifyQueryProps(newQueryParams);
  };

  const handlePhewasCategoryFilter = (
    newPhewasCategoryFilterValue?: PhewasOption[]
  ) => {
    const { phewasCategoryFilter, ...rest } = _parseQueryProps();
    const newQueryParams = {
      ...rest,
    };
    if (
      newPhewasCategoryFilterValue &&
      newPhewasCategoryFilterValue.length > 0
    ) {
      newQueryParams.phewasCategoryFilter = newPhewasCategoryFilterValue.map(
        (d) => d.value
      );
    }
    _stringifyQueryProps(newQueryParams);
  };

  const _parseQueryProps = () => {
    const queryProps = queryString.parse(location.search);

    // single values need to be put in lists
    if (queryProps.phewasTraitFilter) {
      queryProps.phewasTraitFilter = Array.isArray(queryProps.phewasTraitFilter)
        ? queryProps.phewasTraitFilter
        : [queryProps.phewasTraitFilter];
    }
    if (queryProps.phewasCategoryFilter) {
      queryProps.phewasCategoryFilter = Array.isArray(
        queryProps.phewasCategoryFilter
      )
        ? queryProps.phewasCategoryFilter
        : [queryProps.phewasCategoryFilter];
    }
    return queryProps;
  };

  const _stringifyQueryProps = (newQueryParams: ParsedQuery) => {
    navigate({
      ...location,
      search: queryString.stringify(newQueryParams),
    });
  };

  const {
    phewasTraitFilter: phewasTraitFilterUrl,
    phewasCategoryFilter: phewasCategoryFilterUrl,
  } = _parseQueryProps();

  // Render
  if ((headerData && !headerData.variantInfo) || !variantId) {
    return <NotFoundPage />;
  }
  return (
    <BasePage>
      <ScrollToTop />
      <Helmet>
        <title>{variantId}</title>
      </Helmet>
      <Header loading={headerLoading} data={headerData} />
      <Summary variantId={variantId} />

      <>
        <SectionHeading
          heading="Assigned genes"
          subheading="Which genes are functionally implicated by this variant?"
          entities={[
            {
              type: 'variant',
              fixed: true,
            },
            {
              type: 'gene',
              fixed: false,
            },
          ]}
        />
        {isGeneVariant ? (
          <AssociatedGenes
            variantId={variantId}
            genesForVariantSchema={genesForVariantSchema}
            genesForVariant={pageData.genesForVariant}
          />
        ) : (
          // TODO: Remove when PlotContainer is typed
          // @ts-expect-error
          <PlotContainer
            loading={pageLoading}
            error={error}
            center={
              <Typography variant="subtitle1">
                {pageLoading ? '...' : '(no data)'}
              </Typography>
            }
          />
        )}
        <PheWASSection
          variantId={variantId}
          phewasTraitFilterUrl={phewasTraitFilterUrl}
          phewasCategoryFilterUrl={phewasCategoryFilterUrl}
          handlePhewasTraitFilter={handlePhewasTraitFilter}
          handlePhewasCategoryFilter={handlePhewasCategoryFilter}
          isIndexVariant={isIndexVariant}
          isTagVariant={isTagVariant}
        />

        <SectionHeading
          heading="GWAS lead variants"
          subheading="Which GWAS lead variants are linked with this variant?"
          entities={[
            {
              type: 'study',
              fixed: false,
            },
            {
              type: 'indexVariant',
              fixed: false,
            },
            {
              type: 'tagVariant',
              fixed: true,
            },
          ]}
        />
        <AssociatedIndexVariantsTable
          loading={pageLoading}
          error={error}
          data={associatedIndexVariants}
          variantId={variantId}
          filenameStem={`${variantId}-lead-variants`}
        />
        <SectionHeading
          heading="Tag variants"
          subheading="Which variants tag (through LD or fine-mapping) this lead variant?"
          entities={[
            {
              type: 'study',
              fixed: false,
            },
            {
              type: 'indexVariant',
              fixed: true,
            },
            {
              type: 'tagVariant',
              fixed: false,
            },
          ]}
        />
        <AssociatedTagVariantsTable
          loading={pageLoading}
          error={error}
          data={associatedTagVariants}
          variantId={variantId}
          filenameStem={`${variantId}-tag-variants`}
        />
      </>
    </BasePage>
  );
};

export default VariantPage;
