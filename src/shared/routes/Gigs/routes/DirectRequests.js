/*

    GIGS: 

    * Booked directly on booking link from search results.
    * Where the organizer has chatted the DJ first. 
    
    Direct from booking link you can always see all contact information. 
    Other requests, only pros can see contact info. 


    Pros can always see contact information.

    Actions: 

    Decline / View details




    TODO: 
    * filter out gigs to right ones




*/
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NetworkStatus, useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import styled, { keyframes } from 'styled-components';
import { ME, MY_GIGS } from 'components/gql';
import { Body, BodySmall, H3 } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { gigStates } from 'constants/constants';
import AddBookingLink from 'components/AddBookingLink';
import Layout from '../components/Layout';
import swirlyArrow from '../../../assets/icons/swirly-scribbled-arrow.png';

const DirectRequests = ({ user, showExplanation }) => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
    });

    const { data, loading: isLoading, networkStatus } = useQuery(MY_GIGS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            pagination,
            filter: {
                status: [gigStates.REQUESTED],
                opportunity: false,
            },
        },
    });

    const loading = (isLoading && !data) || networkStatus === NetworkStatus.refetch;

    const pageInfo = data?.myGigs?.pageInfo;
    const gigs = loading ? [null, null, null, null, null] : data?.myGigs?.edges || [];

    return (
        <Layout
            title={'Direct requests'}
            gigs={gigs}
            loading={loading}
            pagination={{
                ...pageInfo,
                ...pagination,
            }}
            setPagination={setPagination}
            emptyChildren={<EmptyChildren />}
            rightSideChildren={
                <RightSide user={user} gigs={gigs} showExplanation={showExplanation} />
            }
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
                When organizers pick you, {'\n'}those requests show up here.
            </H3>
            <Body style={{ textAlign: 'center' }}>
                If a customer finds you in the search results or via your <b>booking link</b>, they
                can request to book you directly.
            </Body>
        </>
    );
};

const RightSide = ({ user, gigs, showExplanation }) => {
    return (
        <>
            <GreyBox>
                <H3 small>What are direct requests?</H3>
                <BodySmall>
                    Direct requests are gigs where you've been picked to send an offer. Direct
                    requests are your best chance of getting booked.
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
                <H3 small>How can I get more requests?</H3>
                <BodySmall>
                    Improve your Cueup profile. Make sure you have a professional-looking picture
                    and add testimonials.
                    <br />
                    <br />
                    <a
                        style={{ textDecoration: 'underline' }}
                        target="_blank"
                        href="https://cueup.zendesk.com/hc/en-us/articles/360017431939"
                        rel="noopener noreferrer"
                    >
                        Read more about rank
                    </a>
                </BodySmall>
            </GreyBox>
            <AddBookingLink user={user} small>
                {!gigs.length && <ArrowIndicator />}
            </AddBookingLink>
        </>
    );
};

const shakeAnimation = keyframes`
  0% { transform: translate(-100%, 0%) rotate(45deg) }
  100% { transform:  translate(-100%, 0%) rotate(35deg) }
`;

const ArrowIndicator = styled.div`
    position: absolute;
    bottom: -9%;
    left: 0;
    background: url('${swirlyArrow}');
    height: 60px;
    width: 60px;
    display: block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transform-origin: center right;
    animation-name: ${shakeAnimation};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: steps(2, start);
`;

export default DirectRequests;
