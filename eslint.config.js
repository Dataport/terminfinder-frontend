// @ts-check
const prettierPlugin = require('eslint-plugin-prettier');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplateParser = require('@angular-eslint/template-parser');
const stylisticPlugin = require('@stylistic/eslint-plugin');

module.exports = [
  {
    ignores: [
      '.angular/',
      '.git/',
      '.gitlab/',
      '.github/',
      'cypress/**/*.ts',
      'node_modules/',
      'src/index.html',
      'src/environments/environment.ts',
      'src/sbom.json'
    ]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          './tsconfig.json',
          './tsconfig.spec.json',
          './src/tsconfig.app.json'
        ]
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularPlugin,
      '@stylistic': stylisticPlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...angularPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.rules,
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case'
        }
      ],
      '@stylistic/list-style': [
        'error',
        {
          singleLine: {
            maxItems: Number.POSITIVE_INFINITY
          },
          multiLine: {
            minItems: 0
          },
          overrides: {
            '[]': {
              singleLine: {
                maxItems: 1
              },
              multiLine: {
                minItems: 1
              }
            },
            '{}': 'off',
            '()': 'off',
            ObjectPattern: {
              singleLine: {
                spacing: 'always'
              },
              multiLine: {
                minItems: 1
              }
            }
          }
        }
      ],
      '@stylistic/multiline-ternary': [
        'error',
        'always-multiline'
      ],
      '@stylistic/newline-per-chained-call': [
        'error',
        {
          ignoreChainWithDepth: 3
        }
      ],
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
          maxBOF: 0
        }
      ],
      '@stylistic/template-curly-spacing': 'error',
      semi: [
        'error',
        'always'
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          caughtErrors: 'none'
        }
      ],
      '@typescript-eslint/no-unsafe-function-type': 'off'
    }
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser
    },
    plugins: {
      '@angular-eslint': angularPlugin,
      '@angular-eslint/template': angularPlugin,
      '@stylistic': stylisticPlugin,
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          parser: 'angular'
        }
      ]
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module'
    },
    rules: {
      semi: [
        'error',
        'always'
      ]
    }
  }
];
