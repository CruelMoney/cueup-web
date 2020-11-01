import loadable from '@loadable/component';
const LazyEvents = loadable(() => import('./components/Events'));

export default LazyEvents;
