import loadable from '@loadable/component';
const LazyDjNameGenerator = loadable(() => import('./src/App'));

export default LazyDjNameGenerator;
