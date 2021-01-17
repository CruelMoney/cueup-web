import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import { Media } from 'components/MediaContext';
import { ME } from 'components/gql';
import { identifyUser } from 'utils/analytics';
import DjSearch from 'routes/Home/components/DJSearch';
import Navlink from '../common/Navlink';
import Logo from '../common/Logo';
import EmailVerifier from '../EmailVerifier';
import InstagramConnect from '../InstagramConnect';
import { LoadingIndicator, Container } from '../Blocks';
import DesktopMenu from './DesktopMenu';

const Menu = ({ dark, relative, fullWidth, hideLogin, hideMenuItems, withSearch }) => {
    const { t } = useTranslation();

    const { search } = useLocation();

    const showLogin = search.includes('showLogin');

    const { loading, data } = useQuery(ME);
    const user = data?.me;
    const loggedIn = !!user;
    const isPro = user?.appMetadata?.isPro;
    const isDJ = user?.appMetadata?.roles?.includes('DJ');

    useEffect(() => {
        const user = data?.me;
        if (user) {
            const isPro = user?.appMetadata?.isPro;
            const isDJ = user?.appMetadata?.roles?.includes('DJ');
            const isOrganizer = user?.appMetadata?.roles?.includes('ORGANIZER');

            identifyUser({ userId: user.id, isPro, isDJ, isOrganizer });
        }
    }, [data]);

    if (showLogin) {
        return <Redirect to={t(appRoutes.login)} />;
    }

    return (
        <div
            className={
                'menu-wrapper' + (dark ? ' white-theme' : '') + (relative ? ' relative' : '')
            }
        >
            <EmailVerifier />
            <InstagramConnect />

            <Helmet>
                {isDJ && (
                    <meta
                        name="apple-itunes-app"
                        content="app-id=1458267647, app-argument=userProfile"
                    />
                )}
            </Helmet>

            <Container fullWidth={fullWidth} className="container">
                <div className={'nav-container location_'}>
                    <nav className="navigation">
                        <div className="logo-area">
                            <Navlink to={t(appRoutes.home)}>
                                <Logo />
                            </Navlink>
                        </div>

                        <MainMenu className="main-menu">
                            {withSearch && (
                                <Media greaterThan="sm">
                                    <li>
                                        <DjSearch small dark={dark} />
                                    </li>
                                </Media>
                            )}
                            {!hideMenuItems && (
                                <>
                                    <Media greaterThan="sm">
                                        {loggedIn && !isPro && isDJ && (
                                            <li>
                                                <Navlink
                                                    label={'Go Pro'}
                                                    to={t(appRoutes.userSettings) + '/get-pro'}
                                                />
                                            </li>
                                        )}
                                    </Media>

                                    {loggedIn ? null : (
                                        <li>
                                            <Navlink
                                                to={t(appRoutes.becomeDj)}
                                                label={t('become-a-dj')}
                                                important="true"
                                            />
                                        </li>
                                    )}

                                    {!hideLogin && !loggedIn && !loading ? (
                                        <li>
                                            <Navlink
                                                data-cy="login-button"
                                                to={t(appRoutes.login)}
                                                label={'Log In'}
                                            />
                                        </li>
                                    ) : null}
                                </>
                            )}
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
`;

export default Menu;
