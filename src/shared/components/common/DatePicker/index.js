import loadable from '@loadable/component';

const LazyDatePicker = loadable(() => import('./DatePicker'));

export default LazyDatePicker;
