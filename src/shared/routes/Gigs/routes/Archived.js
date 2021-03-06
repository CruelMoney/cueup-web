/* 

Lost, declined, finished, Canceled 

Passed oppertunities / declined can be undone. 




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

const Archived = ({ user }) => {
    const [pagination, setPagination] = useState({
        page: 1,
        orderBy: 'UPDATED_AT_DESCENDING',
        limit: 8,
    });

    const { data, loading: isLoading, networkStatus } = useQuery(MY_GIGS, {
        variables: {
            pagination,
            filter: {
                status: [
                    gigStates.CANCELLED,
                    gigStates.DECLINED,
                    gigStates.EVENT_CANCELLED,
                    gigStates.LOST,
                    gigStates.ORGANIZER_DECLINED,
                ],
            },
        },
    });

    const loading = (isLoading && !data) || networkStatus === NetworkStatus.refetch;

    const pageInfo = data?.myGigs?.pageInfo;
    const gigs = loading ? [null, null, null, null, null] : data?.myGigs?.edges || [];

    return (
        <Layout
            title={'Archived gigs'}
            gigs={gigs}
            user={user}
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
                Gigs you decline, cancelled events, and{'\n'} gigs that are not relevant anymore
                show up here.
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
                    Gigs you have declined, canceled, or lost to another DJ show up here.
                    <br />
                    You can restore gigs you've declined, and they will move back to requests.
                </BodySmall>
            </GreyBox>
        </>
    );
};

export default Archived;
