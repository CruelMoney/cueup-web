const paths = require('./config/paths');

module.exports = {
    extends: ['wiremore', 'wiremore/react', 'wiremore/typescript'],
    globals: {
        __BROWSER__: true,
        __SERVER__: true,
    },
    env: {
        'cypress/globals': true,
    },
    settings: {
        'import/resolver': {
            node: {
                paths: paths.resolveModules,
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        'react': {
            version: 'detect',
        },
    },
    rules: {
        'import/no-unassigned-import': 0,
        'import/no-named-as-default-member': 0,
        'prettier/prettier': 'error',
        'react/prop-types': 0,
        'react/display-name': 0,
        'no-unused-vars': 1,
        'eqeqeq': 1,
        'no-alert': 0,
        'react/no-unescaped-entities': 0,
        'prefer-const': 1,
        'react/no-unused-prop-types': 1,
        'react/jsx-indent': 1,
        'import/namespace': 1,
        'import/no-unused-modules': [0, { unusedExports: true }],
    },
    overrides: [
        {
            files: ['*.tsx'],
            rules: {
                // TODO: add to eslint-config-wiremore
                'import/named': 0,
                'react/prop-types': 0,
            },
        },
    ],
    plugins: ['cypress', 'chai-friendly'],
};
