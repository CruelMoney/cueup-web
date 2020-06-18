import loadable from '@loadable/component';
const LazyPlayer = loadable(() => import('./Player.js'));

export default LazyPlayer;
