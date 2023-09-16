import { CodegenConfig } from '@graphql-codegen/cli';
import { getApiUrl } from './src/env';

const config: CodegenConfig = {
  schema: `${getApiUrl()}/graphql`,
  documents: [
    'src/**/*.tsx',
    'src/**/*.ts',
    'src/**/*.graphql',
    'src/**/*.gql',
  ],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
      config: {
        scalars: {
          Long: 'number',
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
