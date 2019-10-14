import loadable from '@loadable/component';
const LazyLocation = loadable(() => import('./Location'));
const LazyLocationsOverview = loadable(() => import('./LocationsOverview'));

export { LazyLocationsOverview };
export default LazyLocation;
