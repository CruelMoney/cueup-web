import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import { useQuery } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ME } from 'components/gql';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import thumbEn from '../../assets/images/signup.png';
import thumbDa from '../../assets/images/signup_da.png';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import Layout from './components/Layout';

const Index = () => {
    const { data, loading } = useQuery(ME);
    const { t, currentLanguage } = useTranslate();

    if (!loading && !data?.me) {
        return <Redirect to={t(appRoutes.signUp)} />;
    }

    const title = t('apply-to-become-dj') + ' | Cueup';
    const thumb = Environment.CALLBACK_DOMAIN + (currentLanguage === 'da' ? thumbDa : thumbEn);

    return (
        <div>
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="twitter:title" content={title} />

                <meta property="og:image" content={thumb} />
                <meta name="twitter:image" content={thumb} />
                <meta
                    name="apple-itunes-app"
                    content="app-id=1458267647, app-argument=userProfile"
                />
            </Helmet>
            <ScrollToTop />
            <Layout translate={t} user={data?.me} loading={loading} />
        </div>
    );
};

export default Index;
