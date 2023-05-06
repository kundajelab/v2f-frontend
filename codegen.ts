import { CodegenConfig } from '@graphql-codegen/cli';
import { getDomain } from './env';

const config: CodegenConfig = {
  schema: `http://${getDomain()}:4000/graphql`,
  documents: ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.graphql', 'src/**/*.gql'],
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
