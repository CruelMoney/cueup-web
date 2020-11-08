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
import { useQuery } from '@apollo/client';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import { MY_GIGS } from 'components/gql';
import { BodySmall, H3 } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { gigStates } from 'constants/constants';
import Layout from '../components/Layout';

const Opportunities = ({ user }) => {
    const [pagination, setPagination] = useState({
        page: 1,
    });

    const { data, loading } = useQuery(MY_GIGS, {
        variables: {
            limit: 8,
            pagination,
            filter: {
                status: [gigStates.REQUESTED],
                directBooking: false,
                afterDate: new Date(new Date().toDateString()),
            },
        },
    });

    const pageInfo = data?.myGigs?.pageInfo;
    const gigs = loading ? [null, null, null, null, null] : data?.myGigs?.edges || [];

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
                Gigs you decline, canceled events, and{'\n'} gigs that are not relevant anymore show
                up here.
            </H3>
        </>
    );
};

const RightSide = () => {
    return (
        <>
            <GreyBox>
                <H3 small>What are archived gigs?</H3>
                <BodySmall>
                    Commodo culpa consectetur est dolore incididunt aliqua. Amet pariatur eiusmod
                    tempor laborum enim consectetur. Et aliquip nulla ut in irure adipisicing nulla
                    deserunt qui labore id consectetur deserunt occaecat. Esse qui sint adipisicing
                    qui.
                </BodySmall>
            </GreyBox>
        </>
    );
};

export default Opportunities;
