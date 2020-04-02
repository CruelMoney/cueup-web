import React from 'react';
import styled from 'styled-components';
import Navigation from '../../../../components/SubNavigation';
import { Container, FullWidthCol, Row, Col, GradientBg } from '../../../../components/Blocks';
import { HeaderTitle, BodyBold } from '../../../../components/Text';
import { Spacing } from '../../../../components/Sidebar';

const routes = [
    { route: 'information', label: 'info', active: true },
    { route: 'offer', label: 'offer' },
    { route: 'review', label: 'review' },
    { route: 'chat', label: 'chat', className: 'showMobile' },
];

const StyledGradientBg = styled(GradientBg)`
    height: 300px;
    top: -252px;
`;

const CustomCol = styled(FullWidthCol)`
    @media only screen and (min-width: 425px) {
        padding-right: 60px;
    }
`;
const Header = (props) => {
    return (
        <StyledGradientBg>
            <Container>
                <Row className="wrapper">
                    <CustomCol>
                        {props.loading ? null : <Content {...props} />}
                        <Navigation routes={routes} mobileLabel="Event" showMobile />
                    </CustomCol>
                    <Spacing large />
                </Row>
            </Container>
        </StyledGradientBg>
    );
};

const HeaderWrapper = styled.div`
    padding-bottom: 24px;
`;

const Content = ({ theEvent, statusHumanized }) => {
    const { name, start, location } = theEvent || {};

    return (
        <HeaderWrapper>
            {theEvent && (
                <Row middle>
                    <Col style={{ flex: 1, alignItems: 'flex-start' }}>
                        <HeaderTitle>{name}</HeaderTitle>
                        <BodyBold white opacity={0.75} style={{ margin: 0 }}>
                            {location.name}
                            {'  ·  '}
                            {start.formattedDate}
                        </BodyBold>
                        <BodyBold data-cy="gig-status" white opacity={0.75} style={{ margin: 0 }}>
                            {statusHumanized}
                        </BodyBold>
                    </Col>
                </Row>
            )}
        </HeaderWrapper>
    );
};

export default Header;
