import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { notificationService } from '../utils/NotificationService';
import Navlink from './common/Navlink';
import UserMenuItem from './common/UserMenuItem';
import Login from './common/Login';
import Logo from './common/Logo';
import MobileMenu from './MobileMenu';
import BreadCrumbs from './BreadCrumbs';
import EmailVerifier from './EmailVerifier';
import { ME } from './gql';
import Popup from './common/Popup';
import InstagramConnect from './InstagramConnect';
import { useLogout } from './hooks/useLogout';
import { LoadingIndicator } from './Blocks';

const Menu = ({ translate, history }) => {
    const [loginExpanded, setLoginExpanded] = useState(false);
    const logout = useLogout();

    const doLogout = () => {
        history.push(translate('routes./'));
        logout();
    };

    useEffect(() => {
        const parsedUrl = new URL(window.location.href);
        const showLogin = parsedUrl.searchParams.get('showLogin');

        if (showLogin) {
            setLoginExpanded(true);
        }
    }, [setLoginExpanded]);

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
                                        <li>
                                            <Navlink
                                                buttonLook={true}
                                                to={translate('routes./how-it-works')}
                                                label={translate('how-it-works')}
                                                important={true}
                                            />
                                        </li>

                                        {loggedIn ? null : (
                                            <li>
                                                <Navlink
                                                    buttonLook={true}
                                                    to={translate('routes./become-dj')}
                                                    label={translate('become-a-dj')}
                                                    important={true}
                                                />
                                            </li>
                                        )}
                                        {loggedIn ? null : (
                                            <li>
                                                <Navlink
                                                    buttonLook={true}
                                                    to={translate('routes./signup')}
                                                    label={translate('sign up')}
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
                                                    activeClassName=""
                                                />
                                            </li>
                                        ) : null}

                                        {!loggedIn && !loading ? (
                                            <li>
                                                <button
                                                    className="link-look"
                                                    onClick={() => setLoginExpanded((s) => !s)}
                                                >
                                                    {translate('login')}
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
                                                <LoadingIndicator />
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

const SmartNavigation = withRouter(Menu);

export default SmartNavigation;
