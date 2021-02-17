import React, { useEffect, useMemo, useState } from 'react';
import { NetworkStatus, useQuery } from '@apollo/client';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import { NavLink } from 'react-router-dom';
import { Body, BodySmall, H3 } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { gigStates } from 'constants/constants';
import { SecondaryButton, TeritaryButton } from 'components/Blocks';
import { ProFeature } from 'components/FormComponents';
import Layout from '../components/Layout';
import { MY_OPPORTUNITIES } from '../gql';

const Opportunities = ({ showExplanation }) => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
    });

    const { data, loading: isLoading, networkStatus } = useQuery(MY_OPPORTUNITIES, {
        variables: {
            pagination,
        },
    });

    const loading = (isLoading && !data) || networkStatus === NetworkStatus.refetch;

    const pageInfo = data?.opportunities?.pageInfo;

    const gigs = useMemo(() => {
        let gg = data?.opportunities?.edges || [];
        if (loading) {
            gg = [null, null, null, null, null];
        } else {
            gg = gg.map(({ event, gig }) => ({
                status: gigStates.REQUESTED,
                event,
                ...gig,
                opportunity: true,
            }));
        }

        return gg;
    }, [data, loading]);

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
            rightSideChildren={<RightSide showExplanation={showExplanation} />}
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
            <Body style={{ textAlign: 'center' }}>
                Opportunities show up when an organizer in your area has not booked a DJ yet.
            </Body>
        </>
    );
};

const RightSide = ({ showExplanation }) => {
    return (
        <>
            <GreyBox>
                <H3 small>What are opportunities?</H3>
                <BodySmall>
                    These are people that have requested another DJ, but haven’t completed the
                    booking. It is your “opportunity” to reach out and get a gig.
                </BodySmall>

                <BodySmall
                    style={{
                        marginTop: '1em',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }}
                    onClick={showExplanation}
                >
                    Direct requests vs. opportunities?
                </BodySmall>
            </GreyBox>
            <GreyBox>
                <H3 small>How do I get more opportunities?</H3>
                <BodySmall style={{ marginBottom: 12 }}>
                    You can add more playing locations. If you add multiple cities, you'll see
                    opportunities in all those cities.
                </BodySmall>
                <NavLink to="/u/settings?modal=location">
                    <SecondaryButton style={{ maxWidth: '100%' }}>
                        Add more locations
                        <ProFeature disabled>Pro</ProFeature>
                    </SecondaryButton>
                </NavLink>
            </GreyBox>
        </>
    );
};

export default Opportunities;
