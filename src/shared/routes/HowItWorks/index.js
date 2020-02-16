import loadable from '@loadable/component';
const LazyHowItWorks = loadable(() => import('./HowItWorks'));

export default LazyHowItWorks;
