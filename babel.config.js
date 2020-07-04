module.exports = (api) => {
    api.cache.using(() => process.env.NODE_ENV);

    const isTargetWeb = api.caller((caller) => caller && caller.target === 'web');

    const isDev = ['test', 'production'].includes(process.env.NODE_ENV) === false;

    return {
        compact: true,
        presets: [
            [
                '@babel/env',
                {
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: {
                        version: 3,
                        proposals: true,
                    },
                    ...(isTargetWeb === false && {
                        targets: {
                            node: 'current',
                        },
                    }),
                },
            ],
            '@babel/react',
            '@babel/typescript',
        ],
        plugins: [
            '@loadable/babel-plugin',
            '@babel/proposal-object-rest-spread',
            '@babel/proposal-class-properties',
            '@babel/proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/syntax-dynamic-import',
            '@babel/plugin-transform-runtime',
            'babel-plugin-styled-components',
            'macros',
            isDev && isTargetWeb && 'react-refresh/babel',
        ].filter(Boolean),
        env: {
            test: {
                plugins: [
                    '@babel/transform-modules-commonjs',
                    '@babel/syntax-dynamic-import',
                    '@babel/plugin-transform-runtime',
                ],
            },
            tooling: {
                presets: [
                    [
                        '@babel/env',
                        {
                            modules: 'commonjs',
                        },
                    ],
                    '@babel/typescript',
                ],
            },
        },
    };
};
