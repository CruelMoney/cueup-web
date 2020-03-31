import React, { useState, createContext, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { Query } from 'react-apollo';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import Navlink from './common/Navlink';
import Popup from './common/Popup';
import Login from './common/Login';
import { ME } from './gql';
import { TitleClean } from './Text';
import { useLogout } from './hooks/useLogout';
import useTranslate from './hooks/useTranslate';

const initialContext = {
    registerRoutes: (_routes) => {},
    unregisterRoutes: (_routes) => {},
    routes: [],
    label: null,
};

export const MobileMenuContext = createContext(initialContext);

const compareRoutes = (r1 = [], r2 = [], key = 'route') => {
    // eslint-disable-next-line security/detect-object-injection
    return r1.every((v, idx) => r2[idx] && v[key] === r2[idx][key]);
};
export const ProvideMobileMenu = ({ children }) => {
    const [state, setState] = useState({
        mobileLinks: [],
    });

    const registerMobileLinks = useCallback(
        (routes, mobileLabel) => {
            console.log('register routes');

            setState((state) => {
                const { mobileLinks } = state;
                if (!compareRoutes(routes, mobileLinks)) {
                    let newLinks = mobileLinks.filter(
                        (l) => !routes.map((r) => r.route).includes(l.route)
                    );
                    newLinks = [...newLinks, ...routes];

                    return { ...state, mobileLinks: newLinks, mobileLabel };
                }
                return state;
            });
        },
        [setState]
    );

    const unregisterMobileLinks = useCallback(
        (routes) => {
            setState((state) => {
                const { mobileLinks } = state;
                const newLinks = mobileLinks.filter(
                    (l) => !routes.map((r) => r.route).includes(l.route)
                );
                if (!compareRoutes(mobileLinks, newLinks)) {
                    return {
                        ...state,
                        mobileLinks: newLinks,
                    };
                }
                return state;
            });
        },
        [setState]
    );

    return (
        <MobileMenuContext.Provider
            value={{
                routes: state.mobileLinks,
                unregisterRoutes: unregisterMobileLinks,
                registerRoutes: registerMobileLinks,
                label: state.mobileLabel,
            }}
        >
            {children}
        </MobileMenuContext.Provider>
    );
};

const MobileMenu = ({ isHome }) => {
    const { translate } = useTranslate();
    const [show, setShow] = useState(false);
    const [loginExpanded, setLoginExpanded] = useState(false);
    const logout = useLogout();
    const doLogout = () => {
        logout();
        setShow(false);
    };

    return (
        <Query query={ME} onError={console.log}>
            {({ data = {} }) => {
                const { me: user } = data;

                const loggedIn = !!user;
                const isDJ = user && user.isDj;

                return (
                    <>
                        <button
                            className="mobileMenuButton link-look s"
                            onClick={() => {
                                setShow(true);
                            }}
                        >
                            <h2>Menu</h2>
                        </button>

                        {show &&
                            ReactDOM.createPortal(
                                <Content
                                    show={show}
                                    logout={doLogout}
                                    loggedIn={loggedIn}
                                    user={user}
                                    isDJ={isDJ}
                                    isHome={isHome}
                                    translate={translate}
                                    setShow={setShow}
                                    setLoginExpanded={setLoginExpanded}
                                />,
                                document.querySelector('#mobile-menu-portal')
                            )}

                        <Popup
                            showing={loginExpanded}
                            onClickOutside={() => setLoginExpanded(false)}
                        >
                            <Login onLogin={() => setLoginExpanded(false)} />
                        </Popup>
                    </>
                );
            }}
        </Query>
    );
};

const Content = ({
    show,
    setShow,
    translate,
    isHome,
    isDJ,
    user,
    loggedIn,
    logout,
    setLoginExpanded,
}) => (
    <div className={'mobileMenu' + (show ? ' active' : '')}>
        <div className="menuArea">
            <button onClick={() => setShow(false)} className="popupCloseButton link-look">
                {translate('close')}
            </button>

            <div className="menu">
                <ul>
                    {!isHome ? (
                        <li>
                            <Navlink
                                onClick={() => setShow(false)}
                                buttonLook={true}
                                to={translate(appRoutes.howItWorks)}
                                label={translate('how-it-works')}
                            />
                        </li>
                    ) : null}

                    {isDJ ? (
                        <li>
                            <Navlink
                                onClick={() => setShow(false)}
                                userNavigation={true}
                                to={`${translate(appRoutes.user)}/${user.permalink}/${
                                    userRoutes.overview
                                }`}
                                label={translate('profile')}
                            />
                        </li>
                    ) : null}

                    {isDJ ? (
                        <li>
                            <Navlink
                                onClick={() => setShow(false)}
                                userNavigation={true}
                                to={`${translate(appRoutes.user)}/${user.permalink}/${
                                    userRoutes.gigs
                                }`}
                                label="Gigs"
                            />
                        </li>
                    ) : null}

                    {loggedIn ? (
                        <li>
                            <Navlink
                                onClick={() => setShow(false)}
                                userNavigation={true}
                                to={`${translate(appRoutes.user)}/${user.permalink}/${
                                    userRoutes.settings
                                }`}
                                label={translate('preferences')}
                            />
                        </li>
                    ) : null}

                    {loggedIn ? (
                        <li>
                            <Navlink
                                buttonLook={true}
                                to={translate(appRoutes.home)}
                                onClick={logout}
                                label={translate('log-out')}
                            />
                        </li>
                    ) : null}
                    {loggedIn ? null : (
                        <li>
                            <Navlink
                                onClick={() => setShow(false)}
                                buttonLook={true}
                                to={translate(appRoutes.becomeDj)}
                                label={translate('become-dj')}
                                important={true}
                            />
                        </li>
                    )}
                    {loggedIn ? null : (
                        <li>
                            <Navlink
                                onClick={() => setShow(false)}
                                buttonLook={true}
                                to={translate(appRoutes.signUp)}
                                label={translate('sign up')}
                                important={true}
                            />
                        </li>
                    )}
                    {loggedIn ? null : (
                        <li>
                            <button className="link-look" onClick={() => setLoginExpanded(true)}>
                                {translate('login')}
                            </button>
                        </li>
                    )}
                </ul>

                <MobileMenuContext.Consumer>
                    {({ routes, label }) =>
                        routes.length > 0 && (
                            <>
                                {label && (
                                    <TitleClean
                                        style={{
                                            width: '100%',
                                            marginBottom: '10px',
                                            marginTop: '15px',
                                        }}
                                    >
                                        {label}
                                    </TitleClean>
                                )}
                                <ul style={{ borderTop: '1px solid #e9ecf0' }}>
                                    {routes.map(({ route, label }, idx) => (
                                        <li key={idx}>
                                            <Navlink
                                                onClick={() => setShow(false)}
                                                buttonLook={true}
                                                to={route}
                                                label={label}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )
                    }
                </MobileMenuContext.Consumer>
            </div>
        </div>
    </div>
);

export default MobileMenu;
