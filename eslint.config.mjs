import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import nxEslintPlugin from '@nx/eslint-plugin'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended
})

export default [
  {
    ignores: ['**/dist', '**/out-tsc']
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:testing-library/react',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'prettier'
  ),
  {
    plugins: {
      '@nx': nxEslintPlugin,
      'simple-import-sort': eslintPluginSimpleImportSort,
      import: eslintPluginImport,
      unicorn: eslintPluginUnicorn
    }
  },
  {
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {}
      },
      'mdx/code-blocks': true
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: { ...globals.browser, ...globals.es2021 }
    }
  },
  {
    rules: {
      'testing-library/no-container': 'warn',
      'testing-library/prefer-screen-queries': 'warn',
      'testing-library/no-node-access': ['warn'],
      'react/no-multi-comp': [
        'warn',
        {
          ignoreStateless: false
        }
      ],
      'no-console': 'warn',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
          message: 'Unexpected property on console object was called'
        }
      ],
      'react/no-children-prop': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': [
        'error',
        {
          forbid: [
            {
              char: '>',
              alternatives: ['&gt;']
            },
            {
              char: '}',
              alternatives: ['&#125;']
            }
          ]
        }
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'error',
        {
          enableDangerousAutofixThisMayCauseInfiniteLoops: true
        }
      ],
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
      'no-self-compare': 'warn'
    }
  },
  ...compat
    .config({
      extends: 'plugin:mdx/recommended'
    })
    .map(config => ({
      ...config,
      files: ['**/*.mdx'],
      rules: {
        ...config.rules
      }
    })),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'unicorn/filename-case': [
        'warn',
        {
          cases: {
            kebabCase: true
          }
        }
      ],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: false,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared']
            },
            {
              sourceTag: 'scope:portal',
              onlyDependOnLibsWithTags: [
                'scope:portal',
                'scope:shared',
                'scope:rocketchat-poc'
              ]
            },
            {
              sourceTag: 'scope:oauth-jwt-generator',
              onlyDependOnLibsWithTags: [
                'scope:oauth-jwt-generator',
                'scope:shared'
              ]
            }
          ]
        }
      ]
    }
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
      plugins: ['@typescript-eslint']
    })
    .map(config => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
        'react/jsx-no-constructed-context-values': ['warn'],
        'react/jsx-no-target-blank': 'error',
        'react/no-danger': 'error',
        'react/no-children-prop': 'warn',
        'react/destructuring-assignment': ['warn', 'always'],
        'prefer-spread': 'warn',
        'unicorn/no-useless-spread': 'warn',
        'react/default-props-match-prop-types': ['warn'],
        'react/no-unused-prop-types': ['warn'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        'react/sort-prop-types': [
          'warn',
          {
            callbacksLast: true,
            ignoreCase: false,
            requiredFirst: true,
            sortShapeProp: true,
            noSortAlphabetically: false
          }
        ],
        'react/jsx-curly-brace-presence': [
          'warn',
          {
            props: 'never',
            children: 'never',
            propElementValues: 'always'
          }
        ],
        'react/jsx-no-script-url': [
          'error',
          [
            {
              name: 'Link',
              props: ['to']
            },
            {
              name: 'NavLink',
              props: ['href', 'to']
            },
            {
              name: 'ButtonLink',
              props: ['href', 'to']
            }
          ]
        ],
        '@typescript-eslint/no-extra-semi': 'error',
        'no-extra-semi': 'off'
      }
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript']
    })
    .map(config => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
        '@typescript-eslint/no-extra-semi': 'error',
        'no-extra-semi': 'off'
      }
    })),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000', '^\\.\\u0000'],
            ['^react', '^@?\\w'],
            [
              '^(@|components|libs|lib|assets|utils|.storybook|hooks|ui|partials)(/.*|$)'
            ],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(css)$']
          ]
        }
      ]
    }
  },
  {
    ignores: [
      '/node_modules',
      'dist',
      'coverage',
      'tmp',
      'expo',
      '.next',
      '!.storybook'
    ]
  }
]
