import loadable from '@loadable/component';
const LazyLocation = loadable(() => import('./Location'));

export default LazyLocation;
