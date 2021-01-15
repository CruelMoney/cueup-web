import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from 'react-i18next';
import Menu from 'components/Navigation';
import ScrollToTop from '../../components/common/ScrollToTop';
import About from './components/About';

const Index = () => {
    return (
        <div>
            <ScrollToTop />
            <Menu relative dark />
            <About />
        </div>
    );
};

export default Index;
