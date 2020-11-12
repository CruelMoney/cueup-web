/* 

Completed gigs

Shows an overview of earnings as well

*/

import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import styled from 'styled-components';
import { MY_GIGS } from 'components/gql';
import { Body, BodySmall, H2, H3, HeaderTitle, Title } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { gigStates } from 'constants/constants';
import { Row } from 'components/Blocks';
import useTranslate from 'components/hooks/useTranslate';
import Layout from '../components/Layout';

const Completed = ({ user }) => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        orderBy: 'START_TIME_DESCENDING',
    });

    const { data, loading } = useQuery(MY_GIGS, {
        variables: {
            pagination,
            filter: {
                status: [gigStates.FINISHED],
                afterDate: new Date(new Date(0).toDateString()),
            },
        },
    });

    const pageInfo = data?.myGigs?.pageInfo;
    const gigs = loading ? [null, null, null, null, null] : data?.myGigs?.edges || [];

    return (
        <Layout
            title={'Completed gigs'}
            gigs={gigs}
            loading={loading}
            pagination={{
                ...pageInfo,
                ...pagination,
            }}
            setPagination={setPagination}
            emptyChildren={<EmptyChildren />}
            rightSideChildren={<RightSide />}
            user={user}
        >
            <Earnings gigs={gigs.filter(Boolean)} />
        </Layout>
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
                Gigs you have completed and played show up here.
            </H3>
        </>
    );
};

const RightSide = () => {
    return (
        <>
            <GreyBox>
                <H3 small>How to ask for reviews?</H3>
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

const Earnings = ({ gigs = [] }) => {
    const profit = gigs.reduce((total, gig) => total + (gig?.offer?.totalPayout?.amount || 0), 0);
    const currency = gigs[0]?.offer?.totalPayout?.currency || 'USD';

    const formattedProfit = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(profit / 100);

    return (
        <EarningsWrapper>
            <div>
                <H3 small>Completed gigs</H3>
                <Body>{gigs.length}</Body>
            </div>
            <div>
                <H3 small>Profits</H3>
                <Body>{formattedProfit}</Body>
            </div>
            <div>
                <H3 small>Reviews</H3>
                <Body>0</Body>
            </div>
        </EarningsWrapper>
    );
};

const EarningsWrapper = styled(Row)`
    padding: 50px 0;
    padding-top: 30px;
    > * {
        flex: 1;
        border-right: 2px solid #e9ecf0;
    }
    > *:last-child {
        border: none;
    }
    p,
    h3 {
        text-align: center;
    }
    p {
        font-size: 42px;
        font-weight: 700;
        line-height: 1em;
        letter-spacing: -3px;
        color: #00d1ff;
    }
`;

export default Completed;
