import { Helmet } from 'react-helmet';
import { loader } from 'graphql.macro';
import queryString, { ParsedQuery } from 'query-string';
import { useQuery } from '@apollo/client';
import { useCallback, useMemo, useRef } from 'react';

import { SectionHeading, Typography } from '../../ot-ui-components';
import { PlotContainer } from '../../ot-ui-components';

import BasePage from '../BasePage';
import AssociatedTagVariantsTable from '../../components/AssociatedTagVariantsTable';
import AssociatedIndexVariantsTable from '../../components/AssociatedIndexVariantsTable';
import AssociatedGenes from '../../components/AssociatedGenes';
import ScrollToTop from '../../components/ScrollToTop';
import PheWASSection from '../../components/PheWASSection';
import IGVBrowser, { IGVBrowserHandle } from '../../components/IGVBrowser';
import ExportIGVSession from '../../components/ExportIGV';

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
import { Link } from '@mui/material';

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
  const igvBrowserRef = useRef<IGVBrowserHandle>(null);

  // Memoize the parsed query parameters
  const parsedQueryProps = useMemo(() => {
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
  }, [location.search]); // Dependency: location.search

  // Memoize the stringify function helper
  const _stringifyQueryProps = useCallback(
    (newQueryParams: ParsedQuery) => {
      navigate({
        ...location,
        search: queryString.stringify(newQueryParams),
      });
    },
    [navigate, location]
  ); // Dependencies: navigate, location

  // Queries
  const queryVariables = useMemo(() => ({ variantId }), [variantId]);

  const { loading: headerLoading, data: headerData } = useQuery<
    VariantHeaderQuery,
    VariantHeaderQueryVariables
  >(VARIANT_HEADER_QUERY, {
    variables: queryVariables,
    fetchPolicy: 'cache-first',
  });
  const {
    loading: pageLoading,
    error,
    data: pageData,
  } = useQuery<VariantPageQuery, VariantPageQueryVariables>(
    VARIANT_PAGE_QUERY,
    {
      variables: queryVariables,
      fetchPolicy: 'cache-first',
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
    variables: queryVariables,
    fetchPolicy: 'cache-first',
  });

  // Derived State
  const isGeneVariant = useMemo(
    () => variantHasAssociatedGenes(pageData),
    [pageData]
  );
  const isTagVariant = useMemo(
    () => variantHasAssociatedIndexVariants(pageData),
    [pageData]
  );
  const isIndexVariant = useMemo(
    () => variantHasAssociatedTagVariants(pageData),
    [pageData]
  );

  const associatedIndexVariants = useMemo(() => {
    return isTagVariant
      ? variantTransformAssociatedIndexVariants(pageData!)
      : [];
  }, [isTagVariant, pageData]);

  const associatedTagVariants = useMemo(() => {
    return isIndexVariant
      ? variantTransformAssociatedTagVariants(pageData!)
      : [];
  }, [isIndexVariant, pageData]);

  const genesForVariantSchema = useMemo(() => {
    return isGeneVariant ? variantParseGenesForVariantSchema(pageData!) : [];
  }, [isGeneVariant, pageData]);

  const enhancerGenePredictions = useMemo(() => {
    return (pageData?.variantInfo?.enhancerGenePredictions ||
      []) as VariantPageEnhancerGenePredictionFragment[];
  }, [pageData]);

  const ldTableData = useMemo(() => {
    return (ldData?.linkageDisequilibriumsForVariant ||
      []) as VariantLinkageDisequilibriumFragment[];
  }, [ldData]);

  // Methods

  // Memoize the handlers
  const handlePhewasTraitFilter = useCallback(
    (newPhewasTraitFilterValue?: PhewasOption[]) => {
      const { phewasTraitFilter, ...rest } = parsedQueryProps; // Use memoized parsed props
      const newQueryParams = {
        ...rest,
      };
      if (newPhewasTraitFilterValue && newPhewasTraitFilterValue.length > 0) {
        newQueryParams.phewasTraitFilter = newPhewasTraitFilterValue.map(
          (d) => d.value
        );
      }
      _stringifyQueryProps(newQueryParams);
    },
    [parsedQueryProps, _stringifyQueryProps]
  ); // Dependencies: memoized parsed props, memoized stringify

  const handlePhewasCategoryFilter = useCallback(
    (newPhewasCategoryFilterValue?: PhewasOption[]) => {
      const { phewasCategoryFilter, ...rest } = parsedQueryProps; // Use memoized parsed props
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
    },
    [parsedQueryProps, _stringifyQueryProps]
  ); // Dependencies: memoized parsed props, memoized stringify

  const {
    phewasTraitFilter: phewasTraitFilterUrl,
    phewasCategoryFilter: phewasCategoryFilterUrl,
  } = parsedQueryProps; // Use memoized parsed props

  // Memoize the Locus for the IGV component
  const locus = useMemo(() => {
    const [chromosome, position] = variantId.split('_');
    const intPosition = parseInt(position);
    return `${chromosome}:${intPosition - 5000}-${intPosition + 5000}`;
  }, [variantId]);

  // Render
  if (headerData && !headerData.variantInfo) {
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
          heading="IGV Browser for Enhancer-Gene Model Predictions"
          subheading={
            <span>
              Select cell types to view in the Enhancer-Gene Model Predictions
              table above. See{' '}
              <Link href="/igv" target="_blank" rel="noopener noreferrer">
                here
              </Link>{' '}
              to explore more cell types.
            </span>
          }
        />
        <ExportIGVSession
          igvBrowserRef={igvBrowserRef}
          sessionData={null}
          hideImport={true}
        />
        <IGVBrowser
          key={`igv-browser-${variantId}`}
          locus={locus}
          variantId={variantId}
          ref={igvBrowserRef}
        />

        <SectionHeading
          heading={`Variants in Linkage Disequilibrium with ${variantId}`}
          subheading="Which variants in LD with the query variant overlap predicted enhancers?"
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
          is being queried, it may take a minute to load. Only LDs with r² ≥ 0.8
          are displayed.
        </Typography>
        <LinkageDisequilibriumTable
          loading={ldLoading}
          error={ldError}
          data={ldTableData}
          filenameStem={`${variantId}-lds`}
          variantId={variantId}
        ></LinkageDisequilibriumTable>

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
