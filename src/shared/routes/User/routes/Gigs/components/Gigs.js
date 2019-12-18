import React, { useState } from 'react';
import { connect } from 'react-redux';
import { localize } from 'react-localize-redux';
import { Query } from 'react-apollo';
import EmptyPage from '../../../../../components/common/EmptyPage';
import { LoadingPlaceholder2 } from '../../../../../components/common/LoadingPlaceholder';
import { MY_GIGS } from '../../../../../components/gql';
import { Col, Row, HideBelow } from '../../../../../components/Blocks';
import { Title } from '../../../../../components/Text';
import Checkbox from '../../../../../components/Checkbox';
import { gigStates } from '../../../../../constants/constants';
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
    const { translate, notifications, user, currentLanguage, loading: loadingUser } = props;

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
                const notification = notifications.find((noti) => {
                    return String(noti.room) === String(gig.id);
                });
                gig.hasMessage = notification;
                return gig;
            })
            .sort((g1, g2) => getPriority(g1) - getPriority(g2));

        if (renderGigs.length === 0) {
            return <EmptyPage message={<div>{translate('no-gigs-description')}</div>} />;
        }
        return renderGigs.map((gig, idx) => (
            <GigCard
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
                            </Col>
                        </HideBelow>
                    </Row>
                );
            }}
        </Query>
    );
};

function mapStateToProps(state, ownProps) {
    return {
        notifications: state.notifications.data,
    };
}

const SmartGigs = connect(mapStateToProps)(Gigs);

export default localize(SmartGigs, 'locale');
