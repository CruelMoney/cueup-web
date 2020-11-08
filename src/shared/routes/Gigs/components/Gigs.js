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
import Archived from '../routes/Archived';
import Completed from '../routes/Completed';
import Unconfirmed from '../routes/Unconfirmed';
import Opportunities from '../routes/Opportunities';
import Upcoming from '../routes/Upcoming';
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
            <Container
                style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                fullWidth
            >
                <Hr style={{ marginBottom: 30 }} />
                <Row style={{ flexGrow: 1 }}>
                    <Sidebar user={me} />
                    <Switch>
                        <Route
                            path={'/u/gigs/direct-requests'}
                            render={() => <DirectRequests user={me} />}
                        />
                        <Route path={'/u/gigs/archived'} render={() => <Archived user={me} />} />
                        <Route path={'/u/gigs/completed'} render={() => <Completed user={me} />} />
                        <Route
                            path={'/u/gigs/unconfirmed'}
                            render={() => <Unconfirmed user={me} />}
                        />
                        <Route
                            path={'/u/gigs/opportunities'}
                            render={() => <Opportunities user={me} />}
                        />
                        <Route path={'/u/gigs/upcoming'} render={() => <Upcoming user={me} />} />
                        <Redirect to={'/u/gigs/direct-requests'} />
                    </Switch>
                </Row>
            </Container>
            <Footer noPreFooter />
        </>
    );
};

export default DataWrapper;
