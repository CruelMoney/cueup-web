module.exports = {
    compact: true,
    presets: [
        [
            '@babel/env',
            {
                modules: false,
                targets: {
                    node: 'current',
                },
            },
        ],
        '@babel/react',
        '@babel/typescript',
    ],
    plugins: [
        '@loadable/babel-plugin',
        '@babel/proposal-object-rest-spread',
        '@babel/proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/syntax-dynamic-import',
        'macros',
        'babel-plugin-styled-components',
    ],
    env: {
        test: {
            plugins: [
                '@loadable/babel-plugin',
                '@babel/transform-modules-commonjs',
                '@babel/syntax-dynamic-import',
                '@babel/plugin-transform-runtime',
                'babel-plugin-styled-components',
            ],
        },
    },
};
