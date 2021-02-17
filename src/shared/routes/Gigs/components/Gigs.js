import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@apollo/client';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router';
import createPersistedState from 'use-persisted-state';
import { truncate } from 'lodash';
import Footer from 'components/common/Footer';
import Menu from 'components/Navigation';
import ScrollToTop from 'components/common/ScrollToTop';

import { useAppState } from 'components/hooks/useAppState';
import { useNotifications } from 'components/hooks/useNotifications';
import GigsInformationPopup from 'components/informationPopups/GigsInformation';
import { ME } from '../../../components/gql';
import { Row, Hr, Container, RowMobileCol } from '../../../components/Blocks';

import DirectRequests from '../routes/DirectRequests';
import Archived from '../routes/Archived';
import Completed from '../routes/Completed';
import Unconfirmed from '../routes/Unconfirmed';
import Opportunities from '../routes/Opportunities';
import Upcoming from '../routes/Upcoming';
import Sidebar from './Sidebar';
const useGigsInfoPopup = createPersistedState('gigs-info-popup');

const DataWrapper = () => {
    const { data, loading } = useQuery(ME);
    const { pathname, search } = useLocation();
    const { setAppState } = useAppState();

    const [showPopup, setShowPopup] = useGigsInfoPopup(true);

    const me = data?.me;

    const metaTitle = 'Gigs · Cueup';

    useNotifications({
        userId: me?.id,
    });

    useEffect(() => {
        if (!loading && me) {
            setAppState({
                showSideBarChat: true,
                activeEvent: null,
            });
        }
    }, [me, loading, setAppState]);

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

            {showPopup && <GigsInformationPopup onConfirm={() => setShowPopup(false)} />}

            <Container
                style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                fullWidth
            >
                <Hr style={{ marginBottom: 30 }} />
                <RowMobileCol style={{ flexGrow: 1 }}>
                    <Sidebar user={me} />
                    <Switch>
                        <Route
                            path={'/u/gigs/direct-requests'}
                            render={() => (
                                <DirectRequests
                                    user={me}
                                    showExplanation={() => setShowPopup(true)}
                                />
                            )}
                        />
                        <Route path={'/u/gigs/archived'} render={() => <Archived user={me} />} />
                        <Route path={'/u/gigs/completed'} render={() => <Completed user={me} />} />
                        <Route
                            path={'/u/gigs/unconfirmed'}
                            render={() => <Unconfirmed user={me} />}
                        />
                        <Route
                            path={'/u/gigs/opportunities'}
                            render={() => (
                                <Opportunities
                                    user={me}
                                    showExplanation={() => setShowPopup(true)}
                                />
                            )}
                        />
                        <Route path={'/u/gigs/upcoming'} render={() => <Upcoming user={me} />} />
                        <Redirect to={'/u/gigs/direct-requests'} />
                    </Switch>
                </RowMobileCol>
            </Container>
            <Footer noPreFooter />
        </>
    );
};

export default DataWrapper;
