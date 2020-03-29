import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import {
    PrimaryButton,
    Row,
    Container,
    Col,
    SecondaryButton,
    TeritaryButton,
    ReadMoreButton,
    ReadMore,
} from 'components/Blocks';
import { TextAccent } from 'routes/BecomeDj/components/blocks/TextAccent';
import { Body } from 'components/Text';
import vinyl from '../../../assets/Vinyl.svg';
import krIcon from '../../../assets/money.svg';
import Footer from '../../../components/common/Footer';
import appStoreBadge from '../../../assets/app-store-badge.svg';
import SignUpForm from './SignUpForm';

const Header = styled.header`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    overflow: auto;
    padding-bottom: 0;
    padding-top: 100px;
    .Header-title {
        margin-top: 0 !important;
    }
`;

class Signup extends Component {
    state = {
        reference: null,
    };

    componentDidMount() {
        const query = new URLSearchParams(window.location.search);
        const reference = query.get('referredBy');
        this.setState({
            reference: reference,
        });
    }

    render() {
        const { translate } = this.props;

        return (
            <>
                <Header>
                    <Container>
                        <Row center>
                            <Col middle>
                                <TextAccent>SIGN UP</TextAccent>
                                <h1 className="Header-title text-center common-PageTitle">
                                    {translate('signup.title')}
                                    <span className="Header-subTitle common-PageSubtitle">
                                        {translate('signup.description')}
                                    </span>
                                </h1>
                            </Col>
                        </Row>
                        <Row center style={{ margin: '24px 0' }}>
                            <NavLink to="become-dj">
                                <ReadMore size={'18px'} center white uppercase={false}>
                                    Read more
                                </ReadMore>
                            </NavLink>
                        </Row>
                        <Row
                            style={{
                                margin: '40px 0',
                                marginBottom: '40px',
                            }}
                        >
                            <div className="col-xs-12 center">
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
                            </div>
                        </Row>
                    </Container>
                </Header>
                <div className="container" style={{ marginBottom: '80px' }}>
                    <div className="signup">
                        <Body style={{ marginBottom: 50 }}>
                            Fill out the form to create a profile. After you sign up, we will review
                            your profile to ensure that you meet our requirements. If you don't get
                            approved, we will let you know what changes you need to make. After you
                            have been approved, you will be welcomed and get access to all features.
                        </Body>
                        <SignUpForm translate={translate} reference={this.state.reference} />
                    </div>
                </div>
                <Footer
                    noSkew
                    firstTo={translate('routes./how-it-works')}
                    secondTo={translate('routes./')}
                    firstLabel={translate('how-it-works')}
                    secondLabel={translate('arrange-event')}
                    title={translate('Wonder how it works?')}
                    subTitle={translate('See how it works, or arrange an event.')}
                />
            </>
        );
    }
}

export default Signup;
