import loadable from '@loadable/component';
const LazyGigs = loadable(() => import('./components/Gigs'));

export default LazyGigs;
