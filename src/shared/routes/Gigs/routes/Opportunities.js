/* these are the oppertunities in playinglocations.map(l => l). Add more locations?

 pass or accept an oppertunity by making an offer

 you can only contact if youre a pro 
 you can still make offer if you're not pro (they will be able to do it with auto pricing later anyway)

 if the organizer chats first it goes to direct requests

 when dj starts chatting or sending offer it goes to unconfirmed


 The UI only shows:
 The gigs + pass / accept (make offer)
 
 if not pro:
 A "Go pro" to connect with opportunities.
 
*/

import React, { useMemo, useState } from 'react';
import { NetworkStatus, useQuery } from '@apollo/client';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import { BodySmall, H3 } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { gigStates } from 'constants/constants';
import Layout from '../components/Layout';
import { MY_OPPORTUNITIES } from '../gql';

const Opportunities = () => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
    });

    const { data, loading: isLoading, networkStatus } = useQuery(MY_OPPORTUNITIES, {
        fetchPolicy: 'cache-and-network',
        variables: {
            pagination,
        },
    });

    const loading = (isLoading && !data) || networkStatus === NetworkStatus.refetch;

    const pageInfo = data?.opportunities?.pageInfo;
    let gigs = data?.opportunities?.edges || [];
    if (loading) {
        gigs = [null, null, null, null, null];
    } else {
        gigs = gigs.map(({ event, gig }) => ({
            status: gigStates.REQUESTED,
            event,
            ...gig,
            opportunity: true,
        }));
    }

    return (
        <Layout
            title={'Opportunities'}
            gigs={gigs}
            loading={loading}
            pagination={{
                ...pageInfo,
                ...pagination,
            }}
            setPagination={setPagination}
            emptyChildren={<EmptyChildren />}
            rightSideChildren={<RightSide />}
        />
    );
};

const EmptyChildren = () => {
    return (
        <>
            <Icon
                icon={questionIcon}
                style={{ fontSize: 30, marginBottom: 12, color: '#31DAFF' }}
            />
            <H3 small style={{ textAlign: 'center' }}>
                No more opportunities today,{'\n'} come back later.
            </H3>
        </>
    );
};

const RightSide = () => {
    return (
        <>
            <GreyBox>
                <H3 small>What are opportunities?</H3>
                <BodySmall>
                    Opportunities are events in your area without a DJ. This is your chance to
                    connect with the organizer and get a gig.
                </BodySmall>
            </GreyBox>
        </>
    );
};

export default Opportunities;
