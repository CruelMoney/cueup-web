import loadable from '@loadable/component';
const LazySettings = loadable(() => import('./Settings'));

export default LazySettings;
