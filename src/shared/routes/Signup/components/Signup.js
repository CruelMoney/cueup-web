import React, { Component } from 'react';
import { localize } from 'react-localize-redux';
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
import vinyl from '../../../assets/Vinyl.svg';
import krIcon from '../../../assets/money.svg';
import Footer from '../../../components/common/Footer';
import appStoreBadge from '../../../assets/app-store-badge.svg';
import SignUpForm from './SignUpForm';

const Header = styled.header`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    z-index: -10;
    overflow: auto;
    padding-bottom: 0;
    padding-top: 100px;
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
            <div>
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
                                <ReadMore color={'#fff'} style={{ margin: 'auto', color: '#fff' }}>
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
                        <SignUpForm translate={translate} reference={this.state.reference} />
                    </div>
                </div>
                <Footer
                    noSkew
                    firstTo={translate('routes./')}
                    secondTo={translate('routes./')}
                    firstLabel={translate('how-it-works')}
                    secondLabel={translate('arrange-event')}
                    title={translate('Wonder how it works?')}
                    subTitle={translate('See how it works, or arrange an event.')}
                />
            </div>
        );
    }
}

export default localize(Signup, 'locale');
