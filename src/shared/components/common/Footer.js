import React, { Component } from 'react';
import { NavLink as Link, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import * as c from '../../constants/constants';
import { getTranslatedURL } from '../../utils/HelperFunctions';
import InstagramLogo from '../../assets/InstagramLogo';
// eslint-disable-next-line no-unused-vars
import languageIcon from '../../assets/icons/language.svg';
import ButtonLink from './ButtonLink';

class Footer extends Component {
    static defaultProps = {
        color: '#31DAFF',
        bgColor: '#F6F9FC',
    };

    setActiveLanguage = (code) => {
        const { history, t } = this.props;
        this.props.setActiveLanguage(code);
        let url = history.location.pathname;

        url = getTranslatedURL(url, code, t);

        localStorage.language = code;

        history.replace(url);
    };

    render() {
        const { t } = this.props;

        return (
            <div id="preFooter-wrapper" style={{ order: '10' }}>
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
                        <div>
                            <ul className="locales">
                                <li>
                                    <div
                                        className="dropdown-selector-wrapper"
                                        style={{
                                            color: this.props.color,
                                            fill: this.props.color,
                                        }}
                                    >
                                        <svg
                                            width="13"
                                            height="13"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                        >
                                            <path d="M8.079,9.837L6.116,12.3A0.654,0.654,0,0,1,5,11.841V9.852C2.488,9.351,1,7.6,1,5.5,1,3.015,3.087,1,6.5,1S12,3.015,12,5.5A4.5,4.5,0,0,1,8.079,9.837Z" />
                                        </svg>
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
                                    </div>
                                </li>
                                {!this.props.signedIn ? (
                                    <li>
                                        <div
                                            className="dropdown-selector-wrapper"
                                            style={{
                                                color: this.props.color,
                                                fill: this.props.color,
                                            }}
                                        >
                                            <svg
                                                version="1.1"
                                                id="Capa_1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                x="0px"
                                                y="0px"
                                                viewBox="0 0 481.569 481.569"
                                                xmlSpace="preserve"
                                                width="13"
                                                height="13"
                                            >
                                                <g>
                                                    <path
                                                        d="M444.288,429.288c-5.4-13.2-10.9-26.4-16.9-39.4c-5.3-11.6-12.1-15-24.8-12.1c-16.1,3.7-31.9,8.6-48,11.9
		c-31.1,6.5-62.3,7.1-93-2.6c-38.5-12.1-59-40-71.6-76h104.4c8.2,0,14.8-6.6,14.8-14.8v-32.9c0-8.2-6.6-14.8-14.8-14.8h-114.4
		c0-9.2-0.1-18,0-26.8h114.4c8.2,0,14.8-6.6,14.8-14.8v-32.9c0-8.2-6.6-14.8-14.8-14.8h-100c0-0.4,0-0.8,0.2-1
		c12-27.3,29.5-49.2,58.2-60.6c33.4-13.2,67.5-12.9,101.9-5.8c16.3,3.3,32.3,8.3,48.6,12c11.9,2.7,18.8-0.8,23.9-11.9
		c5.9-12.8,11.3-25.8,16.7-38.9c5.1-12.3,2.1-21-9.5-27.8c-2.9-1.7-5.9-3.1-9-4.3c-48.2-18.8-97.9-25.8-149.2-17.6
		c-36.1,5.8-69.8,18.2-98.9,40.8c-36.7,28.4-60.5,65.9-74.3,110l-1.7,5.1h-51.4c-8.2,0-14.8,6.6-14.8,14.8v32.9
		c0,8.2,6.6,14.8,14.8,14.8h40.5c0,9,0,17.7,0,26.8h-40.5c-8.2,0-14.8,6.6-14.8,14.8v32.9c0,8.2,6.6,14.8,14.8,14.8h48.8
		c3.7,12,6.8,24.2,11.5,35.7c24.7,59.6,66.1,102,128.4,122.2c51.5,16.7,103.4,16.2,155.3,1.9c13.5-3.7,26.9-8.5,39.7-14.4
		C445.988,450.788,449.188,441.188,444.288,429.288z"
                                                    />
                                                </g>
                                            </svg>

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
                                        </div>
                                    </li>
                                ) : null}
                            </ul>
                            <div className="social">
                                <ul>
                                    <li>
                                        <a
                                            href="https://twitter.com/CueupDK"
                                            target="blank"
                                            style={{
                                                color: this.props.color,
                                                fill: this.props.color,
                                            }}
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
                                            style={{
                                                color: this.props.color,
                                                fill: this.props.color,
                                            }}
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
                                            style={{
                                                color: this.props.color,
                                                fill: this.props.color,
                                            }}
                                        >
                                            <InstagramLogo />
                                            Instagram
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h4>{t('top-locations')}</h4>
                            <ul>
                                <li>
                                    <Link to={t(appRoutes.bookDj) + '/united-states/los-angeles'}>
                                        {t('Los Angeles')}
                                    </Link>
                                </li>
                                <li>
                                    <Link to={t(appRoutes.bookDj) + '/denmark/copenhagen'}>
                                        {t('copenhagen')}
                                    </Link>
                                </li>

                                <li>
                                    <Link to={t(appRoutes.bookDj) + '/indonesia/bali'}>Bali</Link>
                                </li>

                                <li>
                                    <Link to={t(appRoutes.bookDj)}>More places</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4>{t('company')}</h4>
                            <ul>
                                <li>
                                    <Link to={t(appRoutes.about)}>{t('about')}</Link>
                                </li>
                                <li>
                                    <a
                                        className="link-look"
                                        href={'mailto:chris@cueup.io?subject=Job inquiry'}
                                    >
                                        {t('Jobs')}
                                    </a>
                                </li>
                                <li>
                                    <Link to={t(appRoutes.becomeDj)}>{t('Become DJ')}</Link>
                                </li>
                                <li>
                                    <Link to={t(appRoutes.terms)}>{t('privacy-and-terms')}</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4>{t('resources')}</h4>
                            <ul>
                                <li>
                                    <Link to={t(appRoutes.faq)}>Help center</Link>
                                </li>
                                <li>
                                    <a
                                        className="link-look"
                                        onClick={() => window.olark('api.box.expand')}
                                    >
                                        {t('contact')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="link-look"
                                        onClick={() => window.olark('api.box.expand')}
                                    >
                                        {t('Feedback')}
                                    </a>
                                </li>
                                <li>
                                    <Link to={t(appRoutes.blog)}>Blog</Link>
                                </li>
                                <li>
                                    <a
                                        className="link-look"
                                        href={'mailto:chris@cueup.io?subject=Press inquiry'}
                                    >
                                        {t('Press')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="copyright">© Cueup {new Date().getFullYear()}</div>
                </footer>
            </div>
        );
    }
}

export default withTranslation()(Footer);
