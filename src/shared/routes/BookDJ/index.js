import loadable from '@loadable/component';
const LazyLocation = loadable(() => import('./Location'));
export const LazySearch = loadable(() => import('./Search'));
export const LazyCountriesOverview = loadable(() => import('./CountriesOverview'));

export default LazyLocation;
