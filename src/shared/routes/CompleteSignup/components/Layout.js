import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Row, Container, Col, ReadMore, LoadingIndicator } from 'components/Blocks';
import { TextAccent } from 'routes/BecomeDj/components/blocks/TextAccent';
import { Body, PageTitle } from 'components/Text';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import Footer from '../../../components/common/Footer';
import appStoreBadge from '../../../assets/app-store-badge.svg';
import SignUpForm from '../../Signup/components/SignUpForm';

const Header = styled.header`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    overflow: auto;
    padding-bottom: 0;
    padding-top: 100px;
    .Header-title {
        margin-top: 0 !important;
    }
`;

const Layout = ({ loading, user }) => {
    console.log({ user });
    const { translate } = useTranslate();
    return (
        <>
            <Header>
                <Container>
                    <Row center>
                        <Col middle>
                            <TextAccent>SIGN UP</TextAccent>
                            <PageTitle className="Header-title text-center common-PageTitle">
                                Complete application
                                <span>Become DJ</span>
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
                        <a href="https://play.google.com/store/apps/details?id=io.cueup.gigs&utm_source=website&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
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
            <Container style={{ marginTop: 50, marginBottom: 80, maxWidth: 900 }}>
                <div className="signup">
                    <Body style={{ marginBottom: 50 }}>
                        Fill out the form to create a profile. After you sign up, we will review
                        your profile to ensure that you meet our requirements. If you don't get
                        approved, we will let you know what changes you need to make. After you have
                        been approved, you will be welcomed and get access to all features.
                    </Body>
                    {loading ? (
                        <LoadingIndicator />
                    ) : (
                        <SignUpForm translate={translate} user={user} />
                    )}
                </div>
            </Container>
            <Footer
                noSkew
                firstTo={translate(appRoutes.becomeDj)}
                secondTo={translate(appRoutes.blog)}
                firstLabel={'Cueup for DJs'}
                secondLabel={'Blog'}
                title={'Join thousands of other DJs.'}
                subTitle={translate('Check the benefits, or read more on our blog.')}
            />
        </>
    );
};

export default Layout;
