import React, { Component } from 'react';
import { NavLink as Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage, setActiveLanguage } from 'react-localize-redux';
import * as c from '../../constants/constants';
/*animation stuff*/
import * as actions from '../../actions/SessionActions';
import { getTranslatedURL } from '../../utils/HelperFunctions';
import InstagramLogo from '../../assets/InstagramLogo';
import ButtonLink from './ButtonLink';

class footer extends Component {
    static defaultProps = {
        color: '#31DAFF',
        bgColor: '#F6F9FC',
    };

    setActiveLanguage = (code) => {
        const { history, translate } = this.props;
        this.props.setActiveLanguage(code);
        let url = history.location.pathname;

        url = getTranslatedURL(url, code, translate);

        localStorage.language = code;

        history.replace(url);
    };

    render() {
        const { translate } = this.props;

        return (
            <div id="preFooter-wrapper">
                <div
                    style={{ backgroundColor: this.props.bgColor }}
                    className={this.props.noSkew ? 'noSkew' : ''}
                    id="preFooter"
                >
                    <div className="container">
                        <div className="row">
                            <div key="preFooterText" className="action-title col-md-7">
                                <span key="preFooterTitle" style={{ color: this.props.color }}>
                                    {this.props.title}
                                </span>
                                {this.props.subTitle}
                            </div>
                            <div key="preFooterButtons" className="col-md-5 action-buttons">
                                <ButtonLink
                                    color={this.props.color}
                                    className="button elevated"
                                    to={this.props.firstTo}
                                >
                                    {this.props.firstLabel}
                                </ButtonLink>
                                <ButtonLink
                                    color={this.props.color}
                                    className="button elevated"
                                    to={this.props.secondTo}
                                >
                                    {this.props.secondLabel}
                                </ButtonLink>
                            </div>
                        </div>
                    </div>
                </div>
                <footer style={{ backgroundColor: this.props.bgColor }}>
                    <div className="footer-columns">
                        <div className="social">
                            <h4>SOCIAL</h4>
                            <ul>
                                <li>
                                    <a
                                        href="https://twitter.com/CueupDK"
                                        target="blank"
                                        style={{ color: this.props.color, fill: this.props.color }}
                                    >
                                        <svg
                                            width="13px"
                                            height="12px"
                                            viewBox="0 5 13 12"
                                            version="1.1"
                                        >
                                            <path
                                                d="M10.9281406,6.02955704 C10.4437083,5.49849144 9.75136521,5.16666222 8.98486722,5.16666222 C7.51563057,5.16666222 6.32326187,6.39123702 6.32326187,7.90147652 C6.32326187,8.11598537 6.34613206,8.32389929 6.39187245,8.52417697 C4.17900801,8.40998051 2.21736917,7.32251088 0.903372627,5.66579446 C0.67397766,6.07120925 0.542993827,6.54153205 0.542993827,7.04239981 C0.542993827,7.99068165 1.01287234,8.82789096 1.72773913,9.31834566 C1.29181939,9.3051558 0.880502434,9.18089339 0.52081667,8.97749179 L0.52081667,9.01081355 C0.52081667,10.3363949 1.43874306,11.442261 2.65779365,11.6925213 C2.43463601,11.7567351 2.19900372,11.7890156 1.95609454,11.7890156 C1.7845681,11.7890156 1.61719987,11.7723547 1.45502941,11.7404213 C1.79392408,12.8265025 2.77664935,13.6175473 3.94198964,13.6387205 C3.03099362,14.3724935 1.88228619,14.8098417 0.635167635,14.8098417 C0.420326427,14.8098417 0.207910846,14.797346 0,14.7723547 C1.17816146,15.5470857 2.57844101,16.0000534 4.08163643,16.0000534 C8.97966945,16.0000534 11.6572146,11.8334446 11.6572146,8.21907457 C11.6572146,8.10001869 11.6551355,7.98130991 11.6506308,7.86468374 C12.1707544,7.47905375 12.622614,6.99762369 12.9781415,6.449203 C12.5013327,6.66648867 11.9877929,6.81365979 11.4493038,6.87960911 C11.999228,6.54153205 12.421287,6.00560703 12.6201884,5.3669399 C12.1052625,5.68002563 11.5362798,5.90772435 10.9281406,6.02955704 Z"
                                                id="Twitter"
                                                stroke="none"
                                                fillRule="evenodd"
                                            />
                                        </svg>
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.facebook.com/cueupdk"
                                        target="blank"
                                        style={{ color: this.props.color, fill: this.props.color }}
                                    >
                                        <svg
                                            width="14px"
                                            height="14px"
                                            viewBox="0 3 14 14"
                                            version="1.1"
                                        >
                                            <path
                                                d="M13.6885715,15.9549117 C13.6885715,16.3728603 13.3503749,16.712 12.9331291,16.712 L9.44489434,16.712 L9.44489434,11.4019242 L11.2242483,11.4019242 L11.4908531,9.3327239 L9.44489434,9.3327239 L9.44489434,8.01127435 C9.44489434,7.41217738 9.61119607,7.00393986 10.4688059,7.00393986 L11.5628177,7.00356635 L11.5628177,5.15249117 C11.3733978,5.12746655 10.7242245,5.07106777 9.96878208,5.07106777 C8.39152574,5.07106777 7.3116831,6.03544955 7.3116831,7.80659534 L7.3116831,9.3327239 L5.52785466,9.3327239 L5.52785466,11.4019242 L7.3116831,11.4019242 L7.3116831,16.712 L0.755442397,16.712 C0.338196572,16.712 0,16.3728603 0,15.9549117 L0,3.75708825 C0,3.33876618 0.338196572,3 0.755442397,3 L12.9331291,3 C13.3503749,3 13.6885715,3.33876618 13.6885715,3.75708825 L13.6885715,15.9549117"
                                                id="Facebook"
                                                stroke="none"
                                                fillRule="evenodd"
                                            />
                                        </svg>
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.instagram.com/cueup.dj.booking/"
                                        target="blank"
                                        style={{ color: this.props.color, fill: this.props.color }}
                                    >
                                        <InstagramLogo />
                                        Instagram
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4>{translate('company')}</h4>
                            <ul>
                                <li>
                                    <Link to={translate('routes./about')}>
                                        {translate('about')}
                                    </Link>
                                </li>
                                <li>
                                    <Link to={translate('routes./blog')}>Blog</Link>
                                </li>
                                <li>
                                    <Link to={translate('routes./faq/dj')}>FAQ</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4>{translate('resources')}</h4>
                            <ul>
                                <li>
                                    <Link to={translate('routes./faq/dj')}>Support</Link>
                                </li>
                                <li>
                                    <a className="link-look" href={'mailto:chris@cueup.io'}>
                                        {translate('contact')}
                                    </a>
                                </li>
                                <li>
                                    <Link to={translate('routes./terms/agreements')}>
                                        {translate('privacy-and-terms')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <Link to={translate('routes./book-dj')}>
                                <h4>{translate('top-locations')}</h4>
                            </Link>
                            <ul>
                                {/* <li>
                  <Link to={translate("/">Worldwide</Link>
                </li> */}
                                <li>
                                    <Link to={'/book-dj/denmark/copenhagen'}>
                                        {translate('copenhagen')}
                                    </Link>
                                </li>
                                <li>
                                    <Link to={'/book-dj/denmark/aarhus'}>Århus</Link>
                                </li>
                                <li>
                                    <Link to={'/book-dj/denmark/odense'}>Odense</Link>
                                </li>
                                {this.props.currentLanguage === 'en' && (
                                    <li>
                                        <Link to={'/book-dj/indonesia/bali'}>Bali</Link>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4>{translate('language-and-currency')}</h4>
                            <ul>
                                <li>
                                    <div className="dropdown-selector-wrapper">
                                        <select
                                            id="language-selector"
                                            className="dropdown-selector"
                                            name="language-selector"
                                            onChange={(e) => this.setActiveLanguage(e.target.value)}
                                            value={this.props.currentLanguage || undefined}
                                        >
                                            <option value={'en'}>English</option>
                                            <option value={'da'}>Dansk</option>
                                        </select>
                                        <svg className="collapsible-arrow" viewBox="0 0 24 24">
                                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                                        </svg>
                                    </div>
                                </li>
                                {!this.props.signedIn ? (
                                    <li>
                                        <div className="dropdown-selector-wrapper">
                                            <select
                                                id="currency-selector"
                                                className="dropdown-selector"
                                                name="currency-selector"
                                                onChange={(e) =>
                                                    this.props.changeCurrency(e.target.value)
                                                }
                                                value={this.props.currency || undefined}
                                            >
                                                <option value={null}>Currency</option>
                                                {c.OrganizerCurrencies.map((c, idx) => (
                                                    <option
                                                        key={`currency-option-${idx}`}
                                                        value={c}
                                                    >
                                                        {c}
                                                    </option>
                                                ))}
                                            </select>
                                            <svg className="collapsible-arrow" viewBox="0 0 24 24">
                                                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                                            </svg>
                                        </div>
                                    </li>
                                ) : null}
                            </ul>
                        </div>
                    </div>
                    <div className="copyright">© Cueup {new Date().getFullYear()}</div>
                </footer>
            </div>
        );
    }
}

function mapStatetoProps(state, ownprops) {
    return {
        signedIn: state.login.status.signedIn,
        currency: state.session.currency,
        translate: getTranslate(state.locale),
        currentLanguage: getActiveLanguage(state.locale).code,
    };
}

function mapDispatchToProps(dispatch, ownprops) {
    return {
        changeCurrency: (currency) => {
            dispatch(actions.changeCurrency(currency));
        },
        setActiveLanguage: (code) => {
            dispatch(setActiveLanguage(code));
        },
    };
}

const SmartFooter = connect(
    mapStatetoProps,
    mapDispatchToProps
)(footer);

export default withRouter(SmartFooter);
