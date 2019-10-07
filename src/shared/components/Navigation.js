import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { useLogout } from '../utils/Hooks';
import { notificationService } from '../utils/NotificationService';
import Navlink from './common/Navlink';
import UserMenuItem from './common/UserMenuItem';
import Button from './common/Button-v2';
import Login from './common/Login';
import Logo from './common/Logo';
import MobileMenu from './MobileMenu';
import BreadCrumbs from './BreadCrumbs';
import EmailVerifier from './EmailVerifier';
import { ME } from './gql';
import addTranslate from './higher-order/addTranslate';
import Popup from './common/Popup';
import InstagramConnect from './InstagramConnect';
import { TitleClean } from './Text';

const Menu = ({ translate, history, location }) => {
    const [loginExpanded, setLoginExpanded] = useState(false);
    const logout = useLogout();

    const doLogout = () => {
        history.push(translate('routes./'));
        logout();
    };

    const isHome = location.pathname === '/' || location.pathname === '/dk';

    return (
        <Query
            query={ME}
            onError={console.log}
            onCompleted={({ me }) => {
                me && notificationService.init(me.id);
            }}
        >
            {({ refetch, loading, data = {} }) => {
                const { me: user } = data;

                const loggedIn = !!user;

                return (
                    <div className="menu-wrapper">
                        <EmailVerifier onVerified={() => setLoginExpanded(true)} />
                        <InstagramConnect />

                        <div className="container">
                            <div className={'nav-container location_'}>
                                <nav className="navigation">
                                    <div className="logo-area">
                                        <Navlink to={translate('routes./')}>
                                            <Logo />
                                        </Navlink>
                                        <BreadCrumbs />
                                    </div>

                                    <MobileMenu />
                                    <ul className="main-menu">
                                        {!isHome ? (
                                            <li>
                                                <Navlink
                                                    buttonLook={true}
                                                    to={translate('routes./')}
                                                    label={translate('arrange-event')}
                                                />
                                            </li>
                                        ) : null}

                                        <li>
                                            <Navlink
                                                buttonLook={true}
                                                to={translate('routes./how-it-works')}
                                                label={translate('how-it-works')}
                                            />
                                        </li>

                                        {!loggedIn && !loading ? (
                                            <li>
                                                <button
                                                    className="link-look"
                                                    onClick={() => setLoginExpanded((s) => !s)}
                                                >
                                                    {translate('login')}
                                                </button>
                                                <Popup
                                                    width={320}
                                                    showing={loginExpanded}
                                                    onClickOutside={() => setLoginExpanded(false)}
                                                >
                                                    <TitleClean>Login</TitleClean>
                                                    <Login
                                                        onLogin={() => setLoginExpanded(false)}
                                                        user={user}
                                                    />
                                                </Popup>
                                            </li>
                                        ) : null}

                                        {loggedIn ? null : (
                                            <li>
                                                <Navlink
                                                    buttonLook={true}
                                                    to={translate('routes./signup')}
                                                    label={translate('apply-to-become-dj')}
                                                    important={true}
                                                />
                                            </li>
                                        )}
                                        {loggedIn ? (
                                            <li>
                                                <Navlink
                                                    buttonLook={true}
                                                    to={translate('routes./')}
                                                    onClick={doLogout}
                                                    label={translate('log-out')}
                                                />
                                            </li>
                                        ) : null}

                                        {loggedIn ? (
                                            <li>
                                                <Navlink
                                                    buttonLook={true}
                                                    to={translate(
                                                        'routes./user/:username/profile',
                                                        {
                                                            username: user.permalink,
                                                        }
                                                    )}
                                                    important={true}
                                                >
                                                    <UserMenuItem
                                                        name={user.userMetadata.firstName}
                                                        picture={user.picture && user.picture.path}
                                                    />
                                                </Navlink>
                                            </li>
                                        ) : null}

                                        {loading ? (
                                            <li>
                                                <Button
                                                    className="redirect-button"
                                                    color="#fff"
                                                    isLoading
                                                />
                                            </li>
                                        ) : null}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                );
            }}
        </Query>
    );
};

const SmartNavigation = withRouter(addTranslate(Menu));

export default SmartNavigation;
