module.exports = {
  'parser': 'babel-eslint',
  'extends': 'airbnb',
  'rules': {
    'indent': [2, 4],
    'linebreak-style': [2, 'unix'],
    'quotes': [2, 'single'],
    'max-len': [2, 120],
    'no-multiple-empty-lines': [2, {'max': 2, 'maxBOF': 0, 'maxEOF': 0}],
    'no-trailing-spaces': 2,
    'no-underscore-dangle': 0,
    'jsx-filename-extension': 0,
    'comma-dangle': 0,
    'jsx-quotes': [0, 'prefer-single'],
    'react/jsx-tag-spacing': {beforeSelfClosing: 'allow'},
    'object-curly-spacing': 0,
    'no-multi-spaces': 0,
    'arrow-parens': [1, 'always'],
    'import/prefer-default-export': 0,
    'import/no-duplicates': 0,
    'import/no-extraneous-dependencies': [1, {'devDependencies': true}],
    'react/no-array-index-key': 0,
    'prefer-rest-params': 0,
    'react/sort-comp': 0,
    'class-methods-use-this': 0,
    'default-case': 0,

    // Temporarily disabled:
    'react/no-multi-comp': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/no-static-element-interactions': 0,

    // Maybe enable later:
    'prefer-template': 0,
    'indent': 0,
    'function-paren-newline': 0,
    'object-curly-newline': 0,
    'react/jsx-indent': 0,
    'react/prop-types': 0,
  },
  'globals': {
    'window' : true,
    'document': true,
    'sessionStorage': true,
  }
};