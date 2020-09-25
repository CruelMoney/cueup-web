import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { createGlobalStyle } from 'styled-components';

import { appRoutes } from 'constants/locales/appRoutes.ts';
import useTranslate from 'components/hooks/useTranslate';
import useAlternativePages from 'components/hooks/useAlternativePages';
import { Container, Row, RowWrap } from 'components/Blocks';
import { showSupportChat } from 'utils/supportChat';
import { useServerContext } from 'components/hooks/useServerContext';
import InstagramLogo from '../../assets/InstagramLogo';
import ButtonLink from './ButtonLink';

const Footer = ({
    color = '#31DAFF',
    bgColor = '#F6F9FC',
    title,
    subTitle,
    firstLabel,
    firstTo,
    secondLabel,
    secondTo,
    firstAction,
}) => {
    const { translate, currentLanguage } = useTranslate();

    const langaugePages = useAlternativePages();

    const setActiveLanguage = (code) => {
        const newPage = langaugePages.find((p) => p.code === code);
        if (newPage) {
            window.history.pushState({}, '', newPage.route);
            window.location.reload();
        }
    };

    return (
        <div id="preFooter-wrapper" style={{ order: '10' }}>
            <GlobalStyle />
            <Helmet>
                {/*  
                    this is a bit out of place here,
                    ideally would be higher in the app, 
                    but the full route match is only available this deep
                */}
                {langaugePages.map(({ active, url, code }) => (
                    <link
                        key={code}
                        href={url}
                        hrefLang={code}
                        rel={active ? 'canonical' : 'alternate'}
                    />
                ))}
            </Helmet>
            <div style={{ backgroundColor: bgColor }} className={'noSkew'} id="preFooter">
                <Container>
                    <RowWrap between middle>
                        <div
                            key="preFooterText"
                            className="action-title"
                            style={{ marginRight: 30 }}
                        >
                            <span key="preFooterTitle" style={{ color: color }}>
                                {title}
                            </span>
                            <span>{subTitle}</span>
                        </div>
                        <RowWrap key="preFooterButtons">
                            <ButtonLink shadow to={firstTo} onClick={firstAction}>
                                {firstLabel}
                            </ButtonLink>
                            <ButtonLink invert shadow to={secondTo}>
                                {secondLabel}
                            </ButtonLink>
                        </RowWrap>
                    </RowWrap>
                </Container>
            </div>
            <FooterWrapper style={{ backgroundColor: bgColor }}>
                <Container>
                    <FooterColumns>
                        <div>
                            <ul className="locales">
                                <li>
                                    <div
                                        className="dropdown-selector-wrapper"
                                        style={{
                                            color: color,
                                            fill: color,
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
                                            aria-label="Choose language"
                                            onChange={(e) => setActiveLanguage(e.target.value)}
                                            defaultValue={currentLanguage}
                                        >
                                            {langaugePages.map(({ code, label }) => (
                                                <option key={code} value={code}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                            </ul>
                            <div className="social">
                                <ul>
                                    <li>
                                        <a
                                            href="https://twitter.com/CueupDK"
                                            target="blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: color,
                                                fill: color,
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
                                            rel="noopener noreferrer"
                                            style={{
                                                color: color,
                                                fill: color,
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
                                            rel="noopener noreferrer"
                                            style={{
                                                color: color,
                                                fill: color,
                                            }}
                                        >
                                            <InstagramLogo />
                                            Instagram
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <TopLocations />
                        <div>
                            <h2 small>{translate('company')}</h2>
                            <ul>
                                <li>
                                    <Link to={translate(appRoutes.about)}>
                                        {translate('about')}
                                    </Link>
                                </li>
                                <li>
                                    <a className="link-look" href="mailto:chris@cueup.io">
                                        {translate('contact')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="link-look"
                                        href={'mailto:chris@cueup.io?subject=Job inquiry'}
                                    >
                                        {translate('Jobs')}
                                    </a>
                                </li>
                                <li>
                                    <Link to={translate(appRoutes.becomeDj)}>
                                        {translate('Become DJ')}
                                    </Link>
                                </li>
                                <li>
                                    <Link to={translate(appRoutes.terms)}>
                                        {translate('privacy-and-terms')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 small>{translate('resources')}</h2>
                            <ul>
                                <li>
                                    <a
                                        className="link-look"
                                        href={'https://cueup.zendesk.com/hc'}
                                        target="blank"
                                        rel="noopener noreferrer"
                                    >
                                        Help center
                                    </a>
                                </li>
                                <li>
                                    <a className="link-look" onClick={showSupportChat}>
                                        {translate('Support chat')}
                                    </a>
                                </li>

                                <li>
                                    <a className="link-look" onClick={showSupportChat}>
                                        {translate('Feedback')}
                                    </a>
                                </li>
                                <li>
                                    <Link to={translate(appRoutes.blog)}>Blog</Link>
                                </li>
                                <li>
                                    <a
                                        className="link-look"
                                        href={'mailto:chris@cueup.io?subject=Press inquiry'}
                                    >
                                        {translate('Press')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="link-look"
                                        href={translate(appRoutes.djNameGenerator)}
                                    >
                                        DJ name generator
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </FooterColumns>
                    <div className="copyright">© Cueup {new Date().getFullYear()}</div>
                </Container>
            </FooterWrapper>
        </div>
    );
};

/* eslint-disable camelcase */
const TopLocations = () => {
    const { translate } = useTranslate();
    const { data } = useServerContext();

    const cities = data?.topCities || [];

    return (
        <div>
            <h2 small>{translate('top-locations')}</h2>
            <ul>
                {cities.map(({ id, city, citySlug, countrySlug }) => (
                    <li key={id}>
                        <a
                            href={translate(appRoutes.bookDj).replace(
                                ':location',
                                citySlug || countrySlug
                            )}
                        >
                            {city}
                        </a>
                    </li>
                ))}

                <li>
                    <a href={translate(appRoutes.bookDjOverview)}>More places</a>
                </li>
            </ul>
        </div>
    );
};

const FooterWrapper = styled.footer`
    .copyright {
        text-align: center;
    }
`;

const FooterColumns = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    > div {
        width: 200px;
    }
    ul {
        margin-top: 0;
    }
    @media only screen and (max-width: 768px) {
        > div {
            margin-bottom: 15px;
            width: 50%;
        }
    }
`;

const GlobalStyle = createGlobalStyle`
    footer a,
    footer .link-look,
    footer .dropdown-selector-wrapper {
        color: #8998aa;
        fill: #8998aa;
        font-size: 15px;
        font-weight: 400;
        margin: auto;
    }
    footer .dropdown-selector-wrapper,
    footer .dropdown-selector {
        color: inherit;
        fill: inherit;
        font-size: 15px;
        font-weight: 600;
        svg {
            margin-right: 6px;
            margin-top: 3px;
        }
    }
    footer h2 {
        font-size: 16px;
        font-weight: 500;
        line-height: 30px;
        color: #4d6480;
    }
    footer .locales {
        margin-top: 0;
    }
    footer a:hover,
    footer .link-look:hover,
    footer .dropdown-selector-wrapper:hover {
        color: #32325d !important;
        cursor: pointer;
        fill: #32325d !important;
    }
    footer .social a {
        font-weight: 600;
    }
    footer .social svg {
        margin-bottom: -1px;
        margin-right: 7px;
    }

    #preFooter-wrapper {
        background: transparent;
        margin-top: -500px;
        overflow: hidden;
        padding-top: 500px;
        pointer-events: none;
        position: relative;
    }
    #preFooter-wrapper > * {
        pointer-events: all;
    }
    #preFooter {
        background: transparent;
        margin-top: 50px;
        padding-bottom: 50px;
        width: 100%;
    }
    #preFooter:before {
        background-color: inherit;
        content: '';
        height: 2000px;
        left: 0;
        position: absolute;
        right: 0;
        top: 350px;
        -webkit-transform: skew(0, -12deg);
        transform: skew(0, -12deg);
        z-index: 0;
    }
    #preFooter.noSkew:before {
        display: none;
    }
    #preFooter.noSkew {
        margin-top: 0;
        padding-top: 50px;
    }
    #preFooter .action-title {
        color: #32325d;
        font-size: 30px;
        font-weight: 500;
        margin: 0.75em 0;
    }
    #preFooter .action-title span {
        display: block;
    }
    #preFooter .action-buttons {
        align-items: center;
        display: flex;
        justify-content: flex-end;
    }

    #preFooter .button {
        min-width: 150px;
    }
`;

export default Footer;
