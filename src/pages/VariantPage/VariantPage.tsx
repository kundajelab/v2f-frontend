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
import IGVBrowser from '../../components/IGVBrowser';

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
import {
  VariantHeaderQuery,
  VariantHeaderQueryVariables,
  VariantLinkageDisequilibriumFragment,
  VariantLinkageDisequilibriumQuery,
  VariantLinkageDisequilibriumQueryVariables,
  VariantPageEnhancerGenePredictionFragment,
  VariantPageQuery,
  VariantPageQueryVariables,
} from '../../__generated__/graphql';
import EnhancerGenePredictionsTable from '../../components/EnhancerGenePredictionsTable';
import LinkageDisequilibriumTable from '../../components/LinkageDisequilibriumTable';

const VARIANT_PAGE_QUERY = loader('../../queries/VariantPageQuery.gql');
const VARIANT_HEADER_QUERY = loader('./VariantHeader.gql');
const VARIANT_LD_QUERY = loader('./VariantLinkageDisequilibrium.gql');

// TODO: Update when PHEWAS is typed
type PhewasOption = {
  value: string;
};
const VariantPage = () => {
  // Router State
  const navigate = useNavigate();
  const location = useLocation();
  const { variantId = '' } = useParams<{ variantId: string }>();

  // Queries
  const { loading: headerLoading, data: headerData } = useQuery<
    VariantHeaderQuery,
    VariantHeaderQueryVariables
  >(VARIANT_HEADER_QUERY, {
    variables: { variantId },
  });
  const {
    loading: pageLoading,
    error,
    data: pageData,
  } = useQuery<VariantPageQuery, VariantPageQueryVariables>(
    VARIANT_PAGE_QUERY,
    {
      variables: { variantId },
    }
  );
  const {
    loading: ldLoading,
    data: ldData,
    error: ldError,
  } = useQuery<
    VariantLinkageDisequilibriumQuery,
    VariantLinkageDisequilibriumQueryVariables
  >(VARIANT_LD_QUERY, {
    variables: { variantId },
  });

  // Derived State
  const isGeneVariant = variantHasAssociatedGenes(pageData);
  const isTagVariant = variantHasAssociatedIndexVariants(pageData);
  const isIndexVariant = variantHasAssociatedTagVariants(pageData);
  const associatedIndexVariants = isTagVariant
    ? variantTransformAssociatedIndexVariants(pageData!)
    : [];
  const associatedTagVariants = isIndexVariant
    ? variantTransformAssociatedTagVariants(pageData!)
    : [];

  const genesForVariantSchema = isGeneVariant
    ? variantParseGenesForVariantSchema(pageData!)
    : [];
  const enhancerGenePredictions = (pageData?.variantInfo
    ?.enhancerGenePredictions ||
    []) as VariantPageEnhancerGenePredictionFragment[];
  const ldTableData = (ldData?.linkageDisequilibriumsForVariant ||
    []) as VariantLinkageDisequilibriumFragment[];

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
  if (headerData && !headerData.variantInfo) {
    return <NotFoundPage />;
  }

  // Return the Locus to the IGV component
  const [chromosome, position] = variantId.split('_');
  const locus = `${chromosome}:${position}`;

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
          heading="Enhancer-Gene Model Predictions"
          subheading="Which genes are predicted to be regulated by enhancers overlapping this variant?"
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
        <EnhancerGenePredictionsTable
          loading={pageLoading}
          error={error}
          data={enhancerGenePredictions}
          variantId={variantId}
          filenameStem={`${variantId}-lead-variants`}
        />
        <SectionHeading
        heading="IGV Browser"
        subheading="Chosen datatracks for this variant can be viewed here"
        />
        <IGVBrowser locus={locus} />  {}

        <SectionHeading
          heading="Linkage Disequilibrium"
          subheading="Which variants are in linkage disequilibrium with this variant?"
          entities={[
            {
              type: 'variant',
              fixed: true,
            },
            {
              type: 'variant',
              fixed: false,
            },
          ]}
        />
        <Typography variant="body1">
          LD information is sourced from 1000 Genomes Phase 3 queried from
          Ensembl using the CEU (Utah residents with Northern and Western
          European ancestry) population. If this is the first time the variant
          is being queried, it may take a minute to load. Only LDs with r² ≥ 0.8 are displayed.
        </Typography>
        <LinkageDisequilibriumTable
          loading={ldLoading}
          error={ldError}
          data={ldTableData}
          filenameStem={`${variantId}-lds`}
          variantId={variantId}
        ></LinkageDisequilibriumTable>

        {/* <SectionHeading
          heading="BPNet Model Predictions"
          subheading="(subheading)"
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
        <BpnetPredictionsTable
          loading={pageLoading}
          error={error}
          data={bpnetPredictions}
          variantId={variantId}
          filenameStem={`${variantId}-lead-variants`}
        /> */}

        <SectionHeading
          heading="Assigned genes (OpenTargets)"
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
            genesForVariant={pageData?.genesForVariant}
          />
        ) : (
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
