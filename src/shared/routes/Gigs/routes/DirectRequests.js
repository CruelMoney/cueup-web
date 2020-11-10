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
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import styled from 'styled-components';
import { ME, MY_GIGS } from 'components/gql';
import { Body, BodySmall, H3 } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { gigStates } from 'constants/constants';
import AddBookingLink from 'components/AddBookingLink';
import Layout from '../components/Layout';
import swirlyArrow from '../assets/swirly-scribbled-arrow.png';

const DirectRequests = ({ user }) => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
    });

    const { data, loading } = useQuery(MY_GIGS, {
        variables: {
            pagination,
            filter: {
                status: [gigStates.REQUESTED],
            },
        },
    });

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
            rightSideChildren={<RightSide user={user} gigs={gigs} />}
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
                When customers pick you, {'\n'}those requests show up here.
            </H3>
            <Body style={{ textAlign: 'center' }}>
                If a customer finds you in the search results or via your <b>booking link</b>, they
                can request to book you directly.
            </Body>
        </>
    );
};

const RightSide = ({ user, gigs }) => {
    return (
        <>
            <GreyBox>
                <H3 small>What are direct requests?</H3>
                <BodySmall>
                    Commodo culpa consectetur est dolore incididunt aliqua. Amet pariatur eiusmod
                    tempor laborum enim consectetur. Et aliquip nulla ut in irure adipisicing nulla
                    deserunt qui labore id consectetur deserunt occaecat. Esse qui sint adipisicing
                    qui.
                </BodySmall>
            </GreyBox>
            <GreyBox>
                <H3 small>How can I get more requests?</H3>
                <BodySmall>
                    Commodo culpa consectetur est dolore incididunt aliqua. Amet pariatur eiusmod
                    tempor laborum enim consectetur. Et aliquip nulla ut in irure adipisicing nulla
                    deserunt qui labore id consectetur deserunt occaecat. Esse qui sint adipisicing
                    qui.
                </BodySmall>
            </GreyBox>
            <AddBookingLink user={user} small>
                {!gigs.length && <ArrowIndicator />}
            </AddBookingLink>
        </>
    );
};

const ArrowIndicator = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-100%, -50%) rotate(45deg);
    background: url('${swirlyArrow}');
    height: 60px;
    width: 60px;
    display: block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;

export default DirectRequests;
