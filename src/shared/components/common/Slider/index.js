import loadable from '@loadable/component';

const LazySlider = loadable(() => import('./Slider'));

export default LazySlider;
