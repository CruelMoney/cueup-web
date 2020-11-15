/* 

Unconfirmed gigs

Work on closing the deal

Chat with the organizer 


*/

import React, { useMemo, useState } from 'react';
import { NetworkStatus, useQuery } from '@apollo/client';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import { MY_GIGS } from 'components/gql';
import { BodySmall, H3 } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { gigStates } from 'constants/constants';
import Layout from '../components/Layout';

const Unconfirmed = ({ user }) => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
    });

    const { data, loading: isLoading, networkStatus } = useQuery(MY_GIGS, {
        variables: {
            pagination,
            filter: {
                status: [gigStates.ACCEPTED],
            },
        },
    });

    const loading = (isLoading && !data) || networkStatus === NetworkStatus.refetch;

    const pageInfo = data?.myGigs?.pageInfo;
    const gigs = loading ? [null, null, null, null, null] : data?.myGigs?.edges || [];

    return (
        <Layout
            title={'Unconfirmed gigs'}
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
                Gigs you've accepted and sent an offer to{'\n'} show up on this page.
            </H3>
        </>
    );
};

const RightSide = () => {
    return (
        <>
            <GreyBox>
                <H3 small>What are unconfirmed gigs?</H3>
                <BodySmall>
                    Unconfirmed gigs are jobs where you've already made an offer, and it's waiting
                    to be accepted by the organizer.
                </BodySmall>
            </GreyBox>
            <GreyBox>
                <H3 small>Remember to chat the organizers</H3>
                <BodySmall>
                    Chatting with the organizer increases your chances of getting booked. <br />{' '}
                    Tell them how interested you are in the job and ask them what they need for the
                    event.
                </BodySmall>
            </GreyBox>
        </>
    );
};

export default Unconfirmed;
