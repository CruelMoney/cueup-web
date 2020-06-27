import loadable from '@loadable/component';
const LazyGetProfessional = loadable(() => import('./PlanChooser'));

export default LazyGetProfessional;
