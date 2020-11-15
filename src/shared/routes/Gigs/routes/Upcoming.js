/* 

Lost, declined, finished, Canceled 

Passed oppertunities / declined can be undone. 




*/
import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import { MY_GIGS } from 'components/gql';
import { Body, BodySmall, H3 } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { gigStates } from 'constants/constants';
import Layout from '../components/Layout';

const Upcoming = () => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
    });

    const { data, loading } = useQuery(MY_GIGS, {
        variables: {
            pagination,
            filter: {
                status: [gigStates.CONFIRMED],
            },
        },
    });

    const pageInfo = data?.myGigs?.pageInfo;
    const gigs = loading ? [null, null, null, null, null] : data?.myGigs?.edges || [];

    return (
        <Layout
            title={'Upcoming gigs'}
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
                If the organizer accepts your offer, {'\n'} the gig shows up here.
            </H3>
            <Body style={{ textAlign: 'center' }}>
                When the gig is upcoming, you can then call or send your contact info to the
                organizer.
            </Body>
        </>
    );
};

const RightSide = () => {
    return (
        <>
            <GreyBox>
                <H3 small>What are upcoming gigs?</H3>
                <BodySmall>
                    If the organizer accepts your offer, the gig is confirmed, and you should
                    prepare to play. You can see all contact info for upcoming gigs and exchange
                    contact details in the chat.
                </BodySmall>
            </GreyBox>
        </>
    );
};

export default Upcoming;
