import loadable from '@loadable/component';
const LazyUser = loadable(() => import('./User'));

export default LazyUser;
