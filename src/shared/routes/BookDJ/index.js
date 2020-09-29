import loadable from '@loadable/component';
const LazyLocation = loadable(() => import('./Location'));
export const LazySearch = loadable(() => import('./Search'));

export default LazyLocation;
