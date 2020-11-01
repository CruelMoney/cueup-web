import React, { useState } from 'react';
import { Query } from '@apollo/client/react/components';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router';
import usePushNotifications from 'components/hooks/usePushNotifications';
import useTranslate from 'components/hooks/useTranslate';
import { useNotifications } from 'components/hooks/useNotifications';
import Footer from 'components/common/Footer';
import Menu from 'components/Navigation';
import ScrollToTop from 'components/common/ScrollToTop';
import AddBookingLink from 'components/AddBookingLink';
import { appRoutes } from 'constants/locales/appRoutes';
import EmptyPage from '../../../components/common/EmptyPage';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';
import { ME, MY_GIGS } from '../../../components/gql';
import { Col, Row, HideBelow, SecondaryButton, Hr, Container } from '../../../components/Blocks';
import { Title, BodySmall } from '../../../components/Text';
import Checkbox from '../../../components/Checkbox';
import { gigStates } from '../../../constants/constants';
import lazyGig from '../../Gig';
import GigCard from './GigCard';

const statusPriority = {
    [gigStates.REQUESTED]: 1,
    [gigStates.CONFIRMED]: 2,
    [gigStates.ACCEPTED]: 3,
    [gigStates.FINISHED]: 4,
};

const getPriority = (gig) => {
    const status = statusPriority[gig.status] || 5;
    return status + (gig.hasMessage ? 0 : 4);
};

const Gigs = (props) => {
    const { translate } = useTranslate();
    const { user, loading: loadingUser } = props;

    const [notifications] = useNotifications({ userId: user?.id });

    const approved = user?.appMetadata?.approved;

    const [filter, setFilter] = useState([]);
    const toggleFilter = (key) => (val) =>
        setFilter((ff) => (val ? [...ff, key] : ff.filter((f2) => f2 !== key)));

    const renderGigs = (gigs) => {
        const rrGigs = gigs
            .filter(
                ({ status }) =>
                    // never show declined and cancelled
                    status !== gigStates.DECLINED &&
                    status !== gigStates.CANCELLED &&
                    // dont show lost or declined as default unless filter is set to show
                    (filter.length > 0 ||
                        ![gigStates.LOST, gigStates.ORGANIZER_DECLINED].includes(status)) &&
                    // show what filter requires, or everything if empty
                    (filter.length === 0 || filter.includes(status))
            )
            .map((gig) => ({
                ...gig,
                hasMessage:
                    notifications[gig.id] &&
                    notifications[gig.id].read < notifications[gig.id].total,
            }))
            .sort((g1, g2) => getPriority(g1) - getPriority(g2));

        if (rrGigs.length === 0) {
            if (!approved) {
                return (
                    <EmptyPage
                        title="No gigs yet"
                        message={
                            <div>
                                We are still reviewing your application. Come back here once you
                                have been approved.
                            </div>
                        }
                    />
                );
            }
            return <EmptyPage message={<div>{translate('no-gigs-description')}</div>} />;
        }
        return rrGigs.map((gig, idx) => (
            <GigCard
                onMouseEnter={() => lazyGig.preload()}
                idx={idx}
                translate={translate}
                hasMessage={gig.hasMessage}
                key={gig.id}
                gig={gig}
                user={user}
            />
        ));
    };

    return (
        <Query query={MY_GIGS} variables={{ limit: 1000 }} onError={console.log}>
            {({ data = {}, loading }) => {
                if (loading || loadingUser) {
                    return <LoadingPlaceholder2 />;
                }

                const { myGigs = {} } = data;
                const { edges: gigs = [] } = myGigs;

                return (
                    <Row>
                        <Col style={{ flex: 1 }}>{gigs && renderGigs(gigs)}</Col>
                        <HideBelow
                            width={768}
                            style={{
                                position: 'sticky',
                                top: 15,
                            }}
                        >
                            <Col
                                style={{
                                    marginLeft: '42px',
                                    width: '185px',
                                }}
                            >
                                <Title style={{ marginBottom: '36px' }}>Filter</Title>
                                <Checkbox
                                    style={{ marginBottom: '12px' }}
                                    label={'Confirmed'}
                                    onChange={toggleFilter(gigStates.CONFIRMED)}
                                />
                                <Checkbox
                                    style={{ marginBottom: '12px' }}
                                    label={'Requested'}
                                    onChange={toggleFilter(gigStates.REQUESTED)}
                                />
                                <Checkbox
                                    style={{ marginBottom: '12px' }}
                                    label={'Accepted'}
                                    onChange={toggleFilter(gigStates.ACCEPTED)}
                                />
                                <Checkbox
                                    style={{ marginBottom: '12px' }}
                                    label={'Finished'}
                                    onChange={toggleFilter(gigStates.FINISHED)}
                                />
                                <Checkbox
                                    style={{ marginBottom: '12px' }}
                                    label={'Lost'}
                                    onChange={(val) => {
                                        toggleFilter(gigStates.LOST)(val);
                                        toggleFilter(gigStates.ORGANIZER_DECLINED)(val);
                                    }}
                                />
                                <EnableNotifications userId={user.id} />
                            </Col>
                        </HideBelow>
                    </Row>
                );
            }}
        </Query>
    );
};

const EnableNotifications = ({ userId }) => {
    const { pushShouldBeEnabled, showPrompt } = usePushNotifications({ userId });
    if (!pushShouldBeEnabled) {
        return null;
    }

    return (
        <div>
            <Title style={{ marginBottom: '36px', marginTop: '36px' }}>Notifications</Title>
            <BodySmall>Enable browser notifications when getting new gigs or messages</BodySmall>
            <SecondaryButton onClick={showPrompt} style={{ marginTop: '12px' }}>
                Enable
            </SecondaryButton>
        </div>
    );
};

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
            <Menu dark relative />
            <Container style={{ minHeight: '80vh' }}>
                <Hr style={{ marginBottom: 30 }} />
                <AddBookingLink user={me} />
                <Gigs user={me} loading={loading} />
            </Container>
            <Footer noPreFooter />
        </>
    );
};

export default DataWrapper;
