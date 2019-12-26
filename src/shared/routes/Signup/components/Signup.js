import React, { Component } from 'react';
import { localize } from 'react-localize-redux';
import vinyl from '../../../assets/Vinyl.svg';
import krIcon from '../../../assets/money.svg';
import Footer from '../../../components/common/Footer';
import appStoreBadge from '../../../assets/app-store-badge.svg';
import SignUpForm from './SignUpForm';

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

    themeColor = '#B031FF';
    secondColor = '#31DAFF';

    render() {
        const { translate } = this.props;

        return (
            <div>
                <header className="">
                    <div id="stripes">
                        <span />
                        <span />
                        <span className="white" />
                        <span />
                    </div>
                    <div className="container">
                        <div className="row center-xs">
                            <div className="col-xs-12">
                                <h1 className="Header-title text-center common-PageTitle">
                                    {translate('signup.title')}
                                    <span className="Header-subTitle common-PageSubtitle">
                                        {translate('signup.description')}
                                    </span>
                                </h1>
                            </div>
                        </div>
                        <div
                            className="row center"
                            style={{
                                marginBottom: '40px',
                                marginTop: '-20px',
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
                        </div>
                    </div>
                    <div className="container">
                        <div className="info-boxes">
                            <div className="row">
                                <div className="col-sm-6 col-md-5 col-md-push-1">
                                    <div className="card">
                                        <img src={krIcon} alt="Money icon" />
                                        <h2 style={{ color: 'rgb(176, 49, 255)' }}>
                                            {translate('signup.sections.left.header')}
                                        </h2>
                                        <p style={{ color: '#32325D' }}>
                                            {translate('signup.sections.left.content')}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-5 col-md-push-1">
                                    <div className="card">
                                        <img src={vinyl} alt="vinyl icon" />
                                        <h2 style={{ color: 'rgb(176, 49, 255)' }}>
                                            {translate('signup.sections.right.header')}
                                        </h2>
                                        <p style={{ color: '#32325D' }}>
                                            {translate('signup.sections.right.content')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container" style={{ marginTop: '80px', marginBottom: '80px' }}>
                    <div className="signup">
                        <SignUpForm translate={translate} reference={this.state.reference} />
                    </div>
                </div>
                <Footer
                    noSkew
                    color={this.themeColor}
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
