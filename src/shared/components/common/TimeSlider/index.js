import loadable from '@loadable/component';

const LazyTimeSlider = loadable(() => import('./TimeSlider'));

export default LazyTimeSlider;
