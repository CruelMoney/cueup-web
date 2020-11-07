import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@apollo/client';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router';
import Footer from 'components/common/Footer';
import Menu from 'components/Navigation';
import ScrollToTop from 'components/common/ScrollToTop';

import { ME } from '../../../components/gql';
import { Col, Row, HideBelow, SecondaryButton, Hr, Container } from '../../../components/Blocks';

import DirectRequests from '../routes/DirectRequests';
import Sidebar from './Sidebar';

const DataWrapper = () => {
    const { data, loading } = useQuery(ME);
    const { pathname, search } = useLocation();
    const me = data?.me;

    const metaTitle = 'Gigs · Cueup';

    if (!loading && !me) {
        return <Redirect to={`/login?redirect=${encodeURIComponent(pathname + search)}`} />;
    }

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="robots" content="noindex" />
            </Helmet>
            <ScrollToTop />
            <Menu dark relative fullWidth />
            <Container style={{ minHeight: '80vh' }} fullWidth>
                <Hr style={{ marginBottom: 30 }} />
                <Row>
                    <Sidebar user={me} />
                    <Switch>
                        <Route path={'/u/gigs/direct-requests'} component={DirectRequests} />
                    </Switch>
                </Row>
            </Container>
            <Footer noPreFooter />
        </>
    );
};

export default DataWrapper;
