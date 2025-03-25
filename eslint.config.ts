import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

import type { Linter } from 'eslint';
import '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig: Linter.Config[] = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'prettier',
      'plugin:prettier/recommended',
    ],
    plugins: [
      '@typescript-eslint',
      'import',
      'react-hooks',
      'prettier',
      'sonarjs',
    ],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      semi: ['error'],
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': ['warn'],
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
      'import/no-duplicates': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prettier/prettier': 'error',
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }],
      'sonarjs/no-empty-collection': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/no-inverted-boolean-check': 'warn',
      'sonarjs/no-nested-template-literals': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
    },
  }),
];

export default eslintConfig;
