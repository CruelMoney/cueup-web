import loadable from '@loadable/component';
const LazyDjNameGenerator = loadable(() => import('./src/DjNameGenerator'));

export default LazyDjNameGenerator;
