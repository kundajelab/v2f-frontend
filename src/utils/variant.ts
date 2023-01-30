import { VariantHeaderQuery, VariantPageQuery } from '../__generated__/graphql';

export function variantHasInfo(data?: VariantHeaderQuery) {
  return data && data.variantInfo;
}
export function variantHasAssociatedGenes(data?: VariantPageQuery) {
  return !!(data && data.genesForVariantSchema);
}

export function variantGetInfo(data: VariantHeaderQuery) {
  return data.variantInfo;
}

export function variantHasAssociatedIndexVariants(data?: VariantPageQuery) {
  return !!(
    data &&
    data.indexVariantsAndStudiesForTagVariant &&
    data.indexVariantsAndStudiesForTagVariant.associations &&
    data.indexVariantsAndStudiesForTagVariant.associations.length > 0
  );
}

export function variantHasAssociatedTagVariants(data?: VariantPageQuery) {
  return !!(
    data &&
    data.tagVariantsAndStudiesForIndexVariant &&
    data.tagVariantsAndStudiesForIndexVariant.associations &&
    data.tagVariantsAndStudiesForIndexVariant.associations.length > 0
  );
}

export function variantTransformAssociatedIndexVariants(
  data: VariantPageQuery
) {
  const associationsFlattened =
    data.indexVariantsAndStudiesForTagVariant.associations.map((d) => {
      const { indexVariant, study, ...rest } = d;
      return {
        indexVariantId: indexVariant.id,
        indexVariantRsId: indexVariant.rsId,
        studyId: study.studyId,
        traitReported: study.traitReported,
        pmid: study.pmid,
        pubDate: study.pubDate,
        pubAuthor: study.pubAuthor,
        ...rest,
      };
    });
  return associationsFlattened;
}

export function variantTransformAssociatedTagVariants(data: VariantPageQuery) {
  const associationsFlattened =
    data.tagVariantsAndStudiesForIndexVariant.associations.map((d) => {
      const { tagVariant, study, ...rest } = d;
      return {
        tagVariantId: tagVariant.id,
        tagVariantRsId: tagVariant.rsId,
        studyId: study.studyId,
        traitReported: study.traitReported,
        pmid: study.pmid,
        pubDate: study.pubDate,
        pubAuthor: study.pubAuthor,
        ...rest,
      };
    });
  return associationsFlattened;
}

export const variantPopulations = [
  { code: 'AFR', description: 'African/African-American' },
  { code: 'AMR', description: 'Latino/Admixed American' },
  { code: 'ASJ', description: 'Ashkenazi Jewish' },
  { code: 'EAS', description: 'East Asian' },
  { code: 'FIN', description: 'Finnish' },
  { code: 'NFE', description: 'Non-Finnish European' },
  { code: 'NFEEST', description: 'Non-Finnish European Estonian' },
  {
    code: 'NFENWE',
    description: 'Non-Finnish European North-Western European',
  },
  { code: 'NFESEU', description: 'Non-Finnish European Southern European' },
  { code: 'OTH', description: 'Other (population not assigned)' },
];

export function variantParseGenesForVariantSchema(data: VariantPageQuery) {
  const genesForVariantSchema = data.genesForVariantSchema;
  const currentQtls = genesForVariantSchema.qtls;
  if (currentQtls.length === 0) return genesForVariantSchema;
  if (currentQtls[0].id === 'pqtl') {
    const pqtl = currentQtls[0];
    const restQtls = currentQtls.slice(1);
    const sourceDescriptionBreakdown = parseSourceDescriptionBreakdown(
      pqtl.sourceDescriptionBreakdown
    );
    const sourceLabel = parseSourceLabel(pqtl.sourceLabel);
    const newPqtl = { ...pqtl, sourceDescriptionBreakdown, sourceLabel };
    const newQtls = [newPqtl, ...restQtls];
    return { ...genesForVariantSchema, qtls: newQtls };
  }
  return genesForVariantSchema;
}

function parseSourceDescriptionBreakdown(description: string | null = '') {
  if (!description) return;
  return description.replace(' Sun *et al.* (2018)', '');
}

function parseSourceLabel(label: string | null = '') {
  if (!label) return;
  return label.replace(' (Sun, 2018)', '');
}
