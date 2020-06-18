import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from 'react-i18next';
import ScrollToTop from '../../components/common/ScrollToTop';
import About from './components/About';

const Index = () => {
    const { t } = useTranslation();
    const title = t('about') + ' | Cueup';

    return (
        <div>
            <Helmet>
                <body className="white-theme" />
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="twitter:title" content={title} />
            </Helmet>
            <ScrollToTop />

            <About />
        </div>
    );
};

export default Index;
