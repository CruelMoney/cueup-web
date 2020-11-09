import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import { Container, Row, ReadMore } from '../../../components/Blocks';

const BackToProfile = () => {
    const { translate } = useTranslate();
    const { state } = useLocation();
    const { comingFrom = `${translate(appRoutes.userGigs)}` } = state || {};
    return (
        <div style={{ backgroundColor: '#f6f9fc' }}>
            <Container>
                <Row middle style={{ height: '42px' }}>
                    <Link to={comingFrom}>
                        <ReadMore back>Back to gigs</ReadMore>
                    </Link>
                </Row>
            </Container>
        </div>
    );
};

export default BackToProfile;
