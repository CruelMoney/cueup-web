import loadable from '@loadable/component';
const LazyGetProfessional = loadable(() => import('./BenefitsPopup'));
const LazyContactInformationPopup = loadable(() => import('./ContactInformationPopup'));

export default LazyGetProfessional;

export { LazyContactInformationPopup };
