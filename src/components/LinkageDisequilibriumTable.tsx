import { Link, OtTable, Tooltip } from '../ot-ui-components';

import { VariantLinkageDisequilibriumFragment } from '../__generated__/graphql';
import { ApolloError } from '@apollo/client';
import React from 'react';

type TableColumn<T> = {
  id: string;
  label: string;
  tooltip?: React.ReactNode;
  renderCell?: (rowData: T) => React.ReactNode;
};

const tableColumns = (
  curVariantId: string
): TableColumn<VariantLinkageDisequilibriumFragment>[] => {
  const conditionalBold = (
    rowData: VariantLinkageDisequilibriumFragment,
    text: React.ReactNode
  ) => {
    return rowData.variantId === curVariantId ? <b>{text}</b> : text;
  };
  return [
    {
      id: 'variantId',
      label: 'Variant',
      renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
        conditionalBold(
          rowData,
          <div>
            <Link key={rowData.variantId} to={`/variant/${rowData.variantId}`}>
              {rowData.variantId}
            </Link>
            {curVariantId === rowData.variantId ? ' (self)' : ''}
          </div>
        ),
    },
    {
      id: 'variantRsId',
      label: 'rsId',
      renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
        conditionalBold(rowData, rowData.variantRsId),
    },
    {
      id: 'position',
      label: 'Position',
      renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
        conditionalBold(rowData, rowData.variantPosition),
    },
    {
      id: 'r2',
      label: 'LD (r²)',
      renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
        conditionalBold(rowData, rowData.r2),
    },
    {
      id: 'dprime',
      label: "LD (D')",
      renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
        conditionalBold(rowData, rowData.dPrime),
    },
    {
      id: 'mostSevereConsequence',
      label: 'Most Severe Consequence',
      renderCell: (rowData: VariantLinkageDisequilibriumFragment) =>
        conditionalBold(rowData, rowData.mostSevereConsequence),
    },
    {
      id: 'egCellTypes',
      label: '# Cell types with E-G prediction',
      renderCell: (rowData: VariantLinkageDisequilibriumFragment) => {
        const cellTypeSet = new Set(rowData.egCellTypes);
        return conditionalBold(
          rowData,
          <Tooltip title={<ul style={{ margin: 0, paddingLeft: 0, listStylePosition: 'inside' }}>{Array.from(cellTypeSet).sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())).map(cellType => <li key={cellType}>{cellType}</li>)}</ul>}>
            <div>{cellTypeSet.size}</div>
          </Tooltip>
        )
      }
    },
    {
      id: 'egGenes',
      label: '# Genes with E-G prediction',
      renderCell: (rowData: VariantLinkageDisequilibriumFragment) => {
        const geneSet = new Set(rowData.egGenes);
        return conditionalBold(
          rowData,
          <Tooltip title={<div>{Array.from(geneSet).sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())).map(gene => <div key={gene}>{gene}</div>)}</div>}>
            <div>{geneSet.size}</div>
          </Tooltip>
        )
      }
    },
  ];
};

type LinkageDisequilibriumTableProps = {
  loading: boolean;
  error?: ApolloError;
  filenameStem: string;
  data: VariantLinkageDisequilibriumFragment[];
  variantId: string;
};
const LinkageDisequilibriumTable = ({
  loading,
  error,
  filenameStem,
  data,
  variantId,
}: LinkageDisequilibriumTableProps) => (
  <OtTable
    loading={loading}
    error={error}
    columns={tableColumns(variantId)}
    data={data}
    sortBy="r2"
    order="desc"
    downloadFileStem={filenameStem}
  />
);

export default LinkageDisequilibriumTable;
