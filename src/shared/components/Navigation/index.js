import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import Navlink from '../common/Navlink';
import Login from '../common/Login';
import Logo from '../common/Logo';
import BreadCrumbs from '../BreadCrumbs';
import EmailVerifier from '../EmailVerifier';
import { ME } from '../gql';
import Popup from '../common/Popup';
import InstagramConnect from '../InstagramConnect';
import { LoadingIndicator, Container } from '../Blocks';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

const Menu = () => {
    const { t } = useTranslation();
    const [loginExpanded, setLoginExpanded] = useState(false);

    useEffect(() => {
        const parsedUrl = new URL(window.location.href);
        const showLogin = parsedUrl.searchParams.get('showLogin');

        if (showLogin) {
            setLoginExpanded(true);
        }
    }, [setLoginExpanded]);

    const { loading, data } = useQuery(ME);
    const { me: user } = data || {};
    const loggedIn = !!user;

    const isPro = user?.appMetadata?.isPro;
    const isDJ = user?.appMetadata?.roles?.includes('DJ');

    return (
        <div className="menu-wrapper">
            <EmailVerifier onVerified={() => setLoginExpanded(true)} />
            <InstagramConnect />

            <Container className="container">
                <div className={'nav-container location_'}>
                    <nav className="navigation">
                        <div className="logo-area">
                            <Navlink to={t(appRoutes.home)}>
                                <Logo />
                            </Navlink>
                            <BreadCrumbs />
                        </div>

                        <MobileMenu />
                        <MainMenu className="main-menu">
                            {loggedIn && !isPro && isDJ && (
                                <li>
                                    <Navlink
                                        label={'Go Pro % Discount this week'}
                                        to={
                                            t(appRoutes.userSettings).replace(
                                                ':permalink',
                                                user.permalink
                                            ) + '/get-pro'
                                        }
                                    />
                                </li>
                            )}

                            {loggedIn ? null : (
                                <li>
                                    <Navlink
                                        to={t(appRoutes.becomeDj)}
                                        label={t('become-a-dj')}
                                        important="true"
                                    />
                                </li>
                            )}
                            {loggedIn ? null : (
                                <li>
                                    <Navlink
                                        to={t(appRoutes.signUp)}
                                        label={t('sign up')}
                                        important="true"
                                    />
                                </li>
                            )}

                            {!loggedIn && !loading ? (
                                <li>
                                    <button
                                        className="link-look"
                                        data-cy="login-button"
                                        onClick={() => setLoginExpanded((s) => !s)}
                                    >
                                        {t('login')}
                                    </button>
                                    <Popup
                                        width={'568px'}
                                        showing={loginExpanded}
                                        onClickOutside={() => setLoginExpanded(false)}
                                    >
                                        <Login
                                            onLogin={() => setLoginExpanded(false)}
                                            user={user}
                                        />
                                    </Popup>
                                </li>
                            ) : null}

                            {loggedIn ? (
                                <li>
                                    <DesktopMenu user={user} />
                                </li>
                            ) : null}

                            {loading ? (
                                <li>
                                    <LoadingIndicator />
                                </li>
                            ) : null}
                        </MainMenu>
                    </nav>
                </div>
            </Container>
        </div>
    );
};

const MainMenu = styled.ul`
    align-items: center;
    display: flex;
    float: right;
    height: 80px;
    list-style-type: none;
    margin: 0px;
    padding: 0;

    > li {
        margin-left: 30px;
        position: relative;
    }
    .redirect-button {
        height: 20px !important;
        width: 20px !important;
    }

    > li:last-child {
        margin-left: 30px;
    }

    a,
    .link-look {
        color: #fff;
        cursor: pointer;
        fill: #fff;
        font-size: 17px;
        font-weight: 600;
        height: 32px;
        letter-spacing: 0.3px;
        line-height: 32px;
        &:hover {
            color: #fff;
            text-decoration: underline;
        }
    }

    @media screen and (max-width: 767px) {
        display: none;
    }
`;

const SmartNavigation = withRouter(Menu);

export default SmartNavigation;
