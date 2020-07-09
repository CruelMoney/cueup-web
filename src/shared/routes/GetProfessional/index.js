import loadable from '@loadable/component';
const LazyGetProfessional = loadable(() => import('./BenefitsPopup'));
const LazyContactInformationPopup = loadable(() => import('./ContactInformationPopup'));
const LazyChatGetProPopup = loadable(() => import('./ChatGetProPopup'));

export default LazyGetProfessional;

export { LazyContactInformationPopup, LazyChatGetProPopup };
