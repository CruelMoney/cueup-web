/*

    GIGS: 

    * Booked directly on booking link from search results.
    * Where the organizer has chatted the DJ first. 
    
    Direct from booking link you can always see all contact information. 
    Other requests, only pros can see contact info. 


    Pros can always see contact information.

    Actions: 

    Decline / Accept


*/
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { MY_GIGS } from 'components/gql';
import { gigStates } from 'constants/constants';
import LazyGig from 'routes/Gig';
import { Col, Hr, Row } from 'components/Blocks';
import { BodySmall, H2, H3, HeaderTitle, Title } from 'components/Text';
import GreyBox from 'components/GreyBox';
import GigCard from './GigCard';

const DirectRequests = () => {
    const [pagination, setPagination] = useState({
        page: 1,
    });

    const { data, loading } = useQuery(MY_GIGS, {
        variables: {
            pagination,
        },
    });

    const gigs = data?.myGigs?.edges || [];

    return (
        <Row style={{ flex: 1 }}>
            <Col style={{ flexGrow: 1 }}>
                <HeaderTitle dark>Direct requests</HeaderTitle>
                <Hr style={{ marginBottom: 24 }} />
                {gigs.map((gig, idx) => (
                    <GigCard
                        key={gig.id}
                        idx={idx}
                        onMouseEnter={() => LazyGig.preload()}
                        hasMessage={gig.hasMessage}
                        gig={gig}
                    />
                ))}
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
            </Col>
        </Row>
    );
};

export default DirectRequests;
