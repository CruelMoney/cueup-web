import React from 'react';
import styled from 'styled-components';
import Navigation from '../../../../components/SubNavigation';
import { Container, FullWidthCol, Row, Col, GradientBg } from '../../../../components/Blocks';
import { HeaderTitle, BodyBold } from '../../../../components/Text';

const getRoutes = (event, pathname) =>
    [
        { route: 'overview', label: 'overview', active: true },
        { route: 'requirements', label: 'requirements', active: true },
        { route: 'review', label: 'review', active: true },
    ].map((r) => ({ ...r, route: pathname + '/' + r.route }));

const StyledGradientBg = styled(GradientBg)`
    height: 300px;
    top: -252px;
`;

const Header = ({ theEvent, loading, pathname }) => {
    return (
        <StyledGradientBg>
            <Container>
                <Row className="wrapper">
                    <FullWidthCol>
                        {loading ? null : <Content theEvent={theEvent} />}
                        <Navigation routes={getRoutes(theEvent, pathname)} mobileLabel="Event" />
                    </FullWidthCol>
                </Row>
            </Container>
        </StyledGradientBg>
    );
};

const HeaderWrapper = styled.div`
    padding-bottom: 24px;
`;

const Content = ({ theEvent }) => {
    const { name, start, end, location } = theEvent;

    return (
        <HeaderWrapper>
            <Row middle>
                <Col style={{ flex: 1, alignItems: 'flex-start' }}>
                    <HeaderTitle>{name}</HeaderTitle>
                    <BodyBold white opacity={0.75} style={{ margin: 0, whiteSpace: 'pre' }}>
                        {location.name}
                        {'  ·  '}
                        {start.formattedDate}
                    </BodyBold>
                    <BodyBold white opacity={0.75} style={{ margin: 0 }}>
                        {start.formattedTime}
                        {' to '}
                        {end.formattedTime}
                    </BodyBold>
                </Col>
            </Row>
        </HeaderWrapper>
    );
};

export default Header;
