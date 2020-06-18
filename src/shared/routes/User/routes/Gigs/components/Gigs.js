import React, { useState } from 'react';
import { Query } from 'react-apollo';
import usePushNotifications from 'components/hooks/usePushNotifications';
import useTranslate from 'components/hooks/useTranslate';
import { useNotifications } from 'components/hooks/useNotifications';
import EmptyPage from '../../../../../components/common/EmptyPage';
import { LoadingPlaceholder2 } from '../../../../../components/common/LoadingPlaceholder';
import { MY_GIGS } from '../../../../../components/gql';
import { Col, Row, HideBelow, SecondaryButton } from '../../../../../components/Blocks';
import { Title, BodySmall } from '../../../../../components/Text';
import Checkbox from '../../../../../components/Checkbox';
import { gigStates } from '../../../../../constants/constants';
import lazyGig from '../../../../Gig';
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
    const { user, currentLanguage, loading: loadingUser } = props;

    const [notifications] = useNotifications({ userId: user?.id });

    const approved = user?.appMetadata?.approved;

    const [filter, setFilter] = useState([]);
    const toggleFilter = (key) => (val) =>
        setFilter((ff) => (val ? [...ff, key] : ff.filter((f2) => f2 !== key)));

    const renderGigs = (gigs) => {
        const renderGigs = gigs
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
            .map((gig) => {
                gig.hasMessage =
                    notifications[gig.id] &&
                    notifications[gig.id].read < notifications[gig.id].total;
                return gig;
            })
            .sort((g1, g2) => getPriority(g1) - getPriority(g2));

        if (renderGigs.length === 0) {
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
        return renderGigs.map((gig, idx) => (
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
        <Query
            query={MY_GIGS}
            variables={{ limit: 1000, locale: currentLanguage }}
            onError={console.log}
        >
            {({ data = {}, loading }) => {
                if (loading || loadingUser) {
                    return <LoadingPlaceholder2 />;
                }

                const { myGigs = {} } = data;
                const { edges: gigs = [] } = myGigs;

                return (
                    <Row>
                        <Col style={{ flex: 1 }}>{gigs && renderGigs(gigs)}</Col>
                        <HideBelow width={768}>
                            <Col style={{ marginLeft: '42px', width: '185px' }}>
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

export default Gigs;
