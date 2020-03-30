import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from 'constants/locales/config';

i18next.use(initReactI18next).init(config);
