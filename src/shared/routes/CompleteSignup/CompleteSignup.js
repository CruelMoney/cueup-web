import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

import { useQuery } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { ME } from 'components/gql';
import addTranslate from '../../components/higher-order/addTranslate';
import thumbEn from '../../assets/images/signup.png';
import thumbDa from '../../assets/images/signup_da.png';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import content from '../Signup/content.json';
import Layout from './components/Layout';

const Index = ({ translate, currentLanguage }) => {
    const { data, loading } = useQuery(ME);

    if (!loading && !data?.me) {
        return <Redirect to={translate('routes./signup')} />;
    }

    const title = translate('apply-to-become-dj') + ' | Cueup';
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
            <Layout translate={translate} user={data?.me} loading={loading} />
        </div>
    );
};

export default addTranslate(Index, content);
