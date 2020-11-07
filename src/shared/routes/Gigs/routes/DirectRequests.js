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
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import Icon from '@iconify/react';
import questionIcon from '@iconify/icons-simple-line-icons/question';
import styled from 'styled-components';
import { MY_GIGS } from 'components/gql';
import LazyGig from 'routes/Gig';
import { Col, Hr, Row } from 'components/Blocks';
import { Body, BodySmall, H2, H3, HeaderTitle, Title } from 'components/Text';
import GreyBox from 'components/GreyBox';
import Pagination from 'components/Pagination';
import { gigStates } from 'constants/constants';
import AddBookingLink from 'components/AddBookingLink';
import GigCard from '../components/GigCard';
import swirlyArrow from '../assets/swirly-scribbled-arrow.png';

const DirectRequests = ({ user }) => {
    const { pathname } = useLocation();
    const [pagination, setPagination] = useState({
        page: 1,
    });

    const { data, loading } = useQuery(MY_GIGS, {
        variables: {
            limit: 8,
            page: pagination.page,
            filter: {
                status: [gigStates.REQUESTED],
                directBooking: true,
            },
        },
    });

    const pageInfo = data?.myGigs?.pageInfo;
    const gigs = loading ? [null, null, null, null, null] : data?.myGigs?.edges || [];

    return (
        <Row style={{ flex: 1, alignItems: 'stretch' }}>
            <Col style={{ flexGrow: 1 }}>
                <HeaderTitle dark>Direct requests</HeaderTitle>
                <Hr style={{ marginBottom: 24 }} />
                {gigs.map((gig, idx) => (
                    <GigCard
                        loading={loading}
                        key={gig?.id || idx}
                        idx={idx}
                        onMouseEnter={() => LazyGig.preload()}
                        hasMessage={gig?.hasMessage}
                        gig={gig}
                    />
                ))}

                {!gigs.length && (
                    <Col center middle style={{ flexGrow: 1, maxWidth: 450, alignSelf: 'center' }}>
                        <Icon
                            icon={questionIcon}
                            style={{ fontSize: 30, marginBottom: 12, color: '#31DAFF' }}
                        />
                        <H3 small style={{ textAlign: 'center' }}>
                            When customers pick you, {'\n'}those requests show up here.
                        </H3>
                        <Body style={{ textAlign: 'center' }}>
                            If a customer finds you in the search results or via your{' '}
                            <b>booking link</b>, they can request to book you directly.
                        </Body>
                    </Col>
                )}

                <Row style={{ marginBottom: 30 }}>
                    {!!pageInfo?.totalPages && (
                        <Pagination
                            activePage={pagination.page}
                            ellipsisBuffer={2}
                            onPageChange={(page) => {
                                setPagination((pp) => ({ ...pagination, ...pp, page }));
                            }}
                            totalPages={pageInfo?.totalPages}
                            hrefConstructor={(page) => `${pathname}?page=${page}`}
                        />
                    )}
                </Row>
            </Col>
            <Col style={{ maxWidth: 350, marginLeft: 60, position: 'sticky', top: 15 }}>
                <GreyBox>
                    <H3 small>What are direct requests?</H3>
                    <BodySmall>
                        Commodo culpa consectetur est dolore incididunt aliqua. Amet pariatur
                        eiusmod tempor laborum enim consectetur. Et aliquip nulla ut in irure
                        adipisicing nulla deserunt qui labore id consectetur deserunt occaecat. Esse
                        qui sint adipisicing qui.
                    </BodySmall>
                </GreyBox>
                <GreyBox>
                    <H3 small>How can I get more requests?</H3>
                    <BodySmall>
                        Commodo culpa consectetur est dolore incididunt aliqua. Amet pariatur
                        eiusmod tempor laborum enim consectetur. Et aliquip nulla ut in irure
                        adipisicing nulla deserunt qui labore id consectetur deserunt occaecat. Esse
                        qui sint adipisicing qui.
                    </BodySmall>
                </GreyBox>
                <AddBookingLink user={user} small>
                    {!gigs.length && <ArrowIndicator />}
                </AddBookingLink>
            </Col>
        </Row>
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
