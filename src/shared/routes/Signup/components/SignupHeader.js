import React from 'react';

import styled from 'styled-components';

import { NavLink } from 'react-router-dom';
import { Row, Container, Col, ReadMore } from 'components/Blocks';
import { TextAccent } from 'routes/BecomeDj/components/blocks/TextAccent';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import { PageTitle } from 'components/Text';
import appStoreBadge from '../../../assets/app-store-badge.svg';

const Header = styled.header`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    overflow: auto;
    padding-bottom: 0;
    padding-top: 100px;
    .Header-title {
        margin-top: 0 !important;
    }
`;

const SignupHeader = () => {
    const { translate } = useTranslate();

    return (
        <Header>
            <Container>
                <Row center>
                    <Col middle>
                        <TextAccent>SIGN UP</TextAccent>
                        <PageTitle className="Header-title text-center common-PageTitle">
                            {translate('signup:title')}
                            <span>{translate('signup:description')}</span>
                        </PageTitle>
                    </Col>
                </Row>
                <Row center style={{ margin: '24px 0' }}>
                    <NavLink to={translate(appRoutes.becomeDj)}>
                        <ReadMore size={'18px'} center white uppercase={false}>
                            Read more
                        </ReadMore>
                    </NavLink>
                </Row>
                <Row
                    center
                    style={{
                        margin: '40px 0',
                        marginBottom: '40px',
                    }}
                >
                    <a href="https://play.google.com/store/apps/details?id=io.cueup.gigs&utm_source=website">
                        <img
                            style={{
                                height: '60px',
                            }}
                            alt="Get it on Google Play"
                            src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
                        />
                    </a>
                    <a href="https://apps.apple.com/us/app/cueup-gigs/id1458267647?mt=8">
                        <img
                            style={{
                                marginTop: '9px',
                                marginRight: '18px',
                            }}
                            alt="Get it on App store"
                            src={appStoreBadge}
                        />
                    </a>
                </Row>
            </Container>
        </Header>
    );
};

export default SignupHeader;
