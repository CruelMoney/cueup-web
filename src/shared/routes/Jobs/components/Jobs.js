import React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { Container, Row, Col, Card, Avatar, PrimaryButton } from 'components/Blocks';
import { Body, H2, PageTitle } from 'components/Text';
import TrustedBy from 'routes/Home/components/TrustedBy';
import GreyBox from 'components/GreyBox';
import Footer from '../../../components/common/Footer';

export default () => {
    const { translate } = useTranslate();
    return (
        <div className="">
            <Helmet>
                <title>{'Jobs | Cueup'}</title>
                <meta property="og:title" content={'Jobs | Cueup'} />
                <meta name="twitter:title" content={'Jobs | Cueup'} />
            </Helmet>
            <ContainerStyled>
                <Row center style={{ marginBottom: '100px' }}>
                    <Col style={{ maxWidth: 800 }}>
                        <PageTitle style={{ marginTop: 60, marginBottom: 60, textAlign: 'center' }}>
                            Help spread the music
                        </PageTitle>

                        <GreyBox>
                            <H2 small center>
                                Open positions
                            </H2>
                            <Body center>No open positions right now.</Body>
                        </GreyBox>
                        <GreyBox>
                            <H2 small center>
                                DJ Jobs
                            </H2>
                            <Body center>
                                Are you interested in becoming a DJ at Cueup? <br />
                                To apply to become DJ at Cueup you simply have to create a profile.{' '}
                                <br />
                                <br />
                                We only approve serious application and might ask you to upload
                                better photos or write a better description of yourself.
                            </Body>
                            <NavLink to={translate(appRoutes.signUp)}>
                                <PrimaryButton style={{ margin: 'auto', marginTop: 24 }}>
                                    Apply to become DJ
                                </PrimaryButton>
                            </NavLink>
                        </GreyBox>
                    </Col>
                </Row>
            </ContainerStyled>

            <Footer noSkew bgColor="#fff" noPreFooter />
        </div>
    );
};

const ContainerStyled = styled(Container)`
    a {
        color: #00d1ff;
        font-weight: 600;
    }
`;
