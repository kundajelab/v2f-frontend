import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import BaseHeader from '../../components/Header';
import { ExternalLink } from '../../components/ExternalLink';
import LocusLink from '../../components/LocusLink';
import { VariantHeaderQuery } from '../../__generated__/graphql';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type VariantHeaderProps = {
  loading: boolean;
  data?: VariantHeaderQuery;
};
const VariantHeader = ({ loading, data }: VariantHeaderProps) => {
  console.log(data);
  const id = data?.variantInfo?.id ?? '';
  const gnomadId = id.replaceAll('_', '-');
  const rsId = data?.variantInfo?.rsId;
  const chromosome = !loading ? id.split('_')[0] : null;
  const positionString = !loading ? id.split('_')[1] : '';
  const position = parseInt(positionString, 10);

  return (
    <BaseHeader
      title={id}
      loading={loading}
      Icon={faMapPin as IconProp}
      externalLinks={
        <>
          <ExternalLink
            title="Ensembl"
            url={`https://identifiers.org/ensembl:${rsId}`}
            id={rsId}
          />
          <ExternalLink
            title="gnomAD 3"
            url={`https://gnomad.broadinstitute.org/variant/${gnomadId}?dataset=gnomad_r3`}
            id={gnomadId}
          />
        </>
      }
    >
      {!loading && (
        <LocusLink
          chromosome={chromosome}
          position={position}
          selectedIndexVariants={[id]}
          selectedTagVariants={[id]}
        />
      )}
    </BaseHeader>
  );
};

export default VariantHeader;
