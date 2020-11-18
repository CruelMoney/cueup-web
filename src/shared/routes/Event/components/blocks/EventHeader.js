import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { eventRoutes } from 'constants/locales/appRoutes';
import Navigation from '../../../../components/Navigation/SubNavigation';
import { Container, FullWidthCol, Row, Col, GradientBg, Hr } from '../../../../components/Blocks';
import { HeaderTitle, BodyBold } from '../../../../components/Text';

const Header = ({ theEvent, loading, pathname }) => {
    return <FullWidthCol>{loading ? null : <Content theEvent={theEvent} />}</FullWidthCol>;
};

const Content = ({ theEvent }) => {
    const { name, start, end, location } = theEvent;

    return (
        <Row middle>
            <Col style={{ flex: 1, alignItems: 'flex-start' }}>
                <HeaderTitle dark>{name}</HeaderTitle>
                <NavLink to={eventRoutes.requirements}>
                    <BodyBold style={{ margin: 0 }}>
                        {location?.name}
                        {'  ·  '}
                        {start?.formattedDate}
                    </BodyBold>
                    <BodyBold style={{ margin: 0 }}>
                        {start?.formattedTime}
                        {' to '}
                        {end?.formattedTime}
                    </BodyBold>
                </NavLink>
                <Hr style={{ margin: '15px 0' }} />
            </Col>
        </Row>
    );
};

export default Header;
