import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import paths from '../paths';
import resolvers from './resolvers';
import plugins from './plugins';
// const { client: clientLoaders } = require('./loaders');
import { client as clientLoaders } from './loaders';
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;

export default {
    name: 'client',
    target: 'web',
    entry: {
        bundle: [
            // Experimentally switched to @babel-env's useBuiltIns: 'entry'
            // require.resolve('core-js/stable'),
            // require.resolve('regenerator-runtime/runtime'),
            paths.srcClient,
        ],
    },
    output: {
        path: path.join(paths.clientBuild, paths.publicPath),
        filename: 'bundle.js',
        publicPath: paths.publicPath,
        chunkFilename: '[name].[chunkhash:8].chunk.js',
    },
    module: {
        rules: clientLoaders,
    },
    resolve: { ...resolvers },
    plugins: [...plugins.shared, ...plugins.client],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [
            new TerserPlugin({
                // TerserPlugin config is taken entirely from react-scripts
                terserOptions: {
                    compress: {
                        toplevel: true,
                    },
                    mangle: {
                        toplevel: true,
                    },
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: 2,
                // Enable file caching
                cache: true,
                sourceMap: generateSourceMap,
            }),
        ],
        namedModules: true,
        noEmitOnErrors: true,
        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        splitChunks: {
            chunks: 'all',
            name: false,
        },
        // Keep the runtime chunk separated to enable long term cagitching
        // https://twitter.com/wSokra/status/969679223278505985
        // https://github.com/facebook/create-react-app/issues/5358
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}`,
        },
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendor',
        //             chunks: 'all',
        //         },
        //     },
        // },
    },
    stats: {
        cached: false,
        cachedAssets: false,
        chunks: false,
        chunkModules: false,
        children: false,
        colors: true,
        hash: false,
        modules: false,
        reasons: false,
        timings: true,
        version: false,
    },
};
