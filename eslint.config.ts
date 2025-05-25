import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import sonarjs from 'eslint-plugin-sonarjs';

import '@typescript-eslint/eslint-plugin';
import type { Linter } from 'eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig: Linter.Config[] = [
  sonarjs.configs.recommended,
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'prettier',
      'plugin:prettier/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-type-checked',
      'plugin:@typescript-eslint/stylistic-type-checked',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:react-hooks/recommended',
    ],
    plugins: ['@typescript-eslint', 'import', 'react-hooks', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  }),
];

export default eslintConfig;
