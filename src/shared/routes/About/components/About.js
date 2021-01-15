import React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { Container, Row, Col, Card, Avatar } from 'components/Blocks';
import { Body, PageTitle } from 'components/Text';
import TrustedBy from 'routes/Home/components/TrustedBy';
import Footer from '../../../components/common/Footer';

export default () => {
    const themeColor = '#25F4D2';
    const { translate } = useTranslate();
    const description =
        ' We strive to help DJs grow and connect them across borders - all by making it easier for event organizers to find a DJ than ever before.';
    return (
        <div className="">
            <Helmet>
                <title>{'About Us | Cueup'}</title>
                <meta property="og:title" content={'About Us | Cueup'} />
                <meta name="twitter:title" content={'About Us | Cueup'} />

                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="twitter:description" content={description} />
            </Helmet>
            <ContainerStyled>
                <Row center style={{ marginBottom: '100px' }}>
                    <Col style={{ maxWidth: 600 }}>
                        <PageTitle style={{ textAlign: 'center', marginTop: 60 }}>
                            Hello from <br />
                            Cueup DJ Booking
                        </PageTitle>
                        <Body center style={{ marginBottom: '100px', fontSize: 22 }}>
                            {description}
                        </Body>

                        <Avatar
                            size="extraLarge"
                            src="https://d1i5zrp3ng76nh.cloudfront.net/social_images/christopher_2.jpg"
                            style={{ margin: 'auto', marginBottom: 15 }}
                        />
                        <PageTitle style={{ textAlign: 'center' }}>Meet the founder</PageTitle>
                        <Card shadow style={{ padding: '2em', fontStyle: 'italic' }}>
                            <Body>Hi, I'm Christopher. I'm a DJ, and founder of Cueup 👋</Body>

                            <Body>
                                <br />
                                I'm Born and raised in Denmark but have been living a nomadic
                                lifestyle since 2017. Most of the time, you'll see me working on
                                Cueup, but I occasionally create small side projects for fun.
                            </Body>
                            <Body>
                                <br />
                                You can find me on{' '}
                                <a
                                    href="https://twitter.com/ChrisDengso"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    Twitter
                                </a>{' '}
                                or send me an email anytime on
                                <a href="mailto:chris@cueup.io"> chris@cueup.io</a>. Also, check out
                                my{' '}
                                <NavLink
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    to="/user/spinso"
                                >
                                    Cueup profile
                                </NavLink>
                                .
                            </Body>
                        </Card>
                    </Col>
                </Row>

                <TrustedBy
                    style={{ marginBottom: 60 }}
                    label={"From regular parties to the world's largest companies"}
                />
            </ContainerStyled>

            <Footer
                noSkew
                color={themeColor}
                firstTo={translate(appRoutes.home)}
                secondTo={translate(appRoutes.signUp)}
                firstLabel={translate('Find DJs')}
                secondLabel={translate('Become DJ')}
                title={translate('Ready to get started?')}
                subTitle={translate('Arrange an event, or apply to become DJ.')}
            />
        </div>
    );
};

const ContainerStyled = styled(Container)`
    a {
        color: #00d1ff;
        font-weight: 600;
    }
`;
