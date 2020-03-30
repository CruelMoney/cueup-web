import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import { userRoutes } from 'routes/User/routes';
import { Container, Row, ReadMore } from '../../../components/Blocks';

const BackToProfile = ({ permalink }) => {
    const { translate } = useTranslate();

    useEffect(() => {
        document.body.classList.add('pre-header-content');
        return () => {
            document.body.classList.remove('pre-header-content');
        };
    }, []);

    return (
        <div style={{ backgroundColor: '#f6f9fc' }}>
            <Container>
                <Row middle style={{ height: '42px' }}>
                    <Link to={`${translate(appRoutes.user)}/${permalink}/${userRoutes.gigs}`}>
                        <ReadMore back>Back to gigs</ReadMore>
                    </Link>
                </Row>
            </Container>
        </div>
    );
};

export default BackToProfile;
