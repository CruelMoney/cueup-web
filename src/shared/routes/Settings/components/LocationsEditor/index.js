import loadable from '@loadable/component';

const LazyLocationEditor = loadable(() => import('./Editor'));

export default LazyLocationEditor;
