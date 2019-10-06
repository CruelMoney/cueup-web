const { storybook: loaders } = require('./loaders');
const { client: plugins } = require('./plugins');
const resolvers = require('./resolvers');

module.exports = async ({ config, mode }) => {
    config.plugins = [...config.plugins, ...plugins];
    config.module.rules = [...config.module.rules, ...loaders];

    config.resolve.extensions = config.resolve.extensions.concat(['.ts', '.tsx']);

    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/,
    });

    config.resolve = resolvers;

    return config;
};
