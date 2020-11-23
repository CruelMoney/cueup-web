import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Container, Row, ReadMore } from '../../../components/Blocks';

const BackToEvent = ({ eventId, hash }) => {
    return (
        <div style={{ backgroundColor: '#f6f9fc' }}>
            <Helmet>
                <body className="pre-header-content" />
            </Helmet>
            <Container>
                <Row middle style={{ height: '42px' }}>
                    <Link to={`/event/${eventId}/${hash}/overview`}>
                        <ReadMore back>Back to event</ReadMore>
                    </Link>
                </Row>
            </Container>
        </div>
    );
};

export default BackToEvent;
