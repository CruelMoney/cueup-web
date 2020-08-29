import React, { useState, createContext, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { Query, useQuery } from 'react-apollo';
import styled, { createGlobalStyle } from 'styled-components';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import { ClosePopupButton } from 'components/Blocks';
import Navlink from '../common/Navlink';
import Popup from '../common/Popup';
import Login from '../common/Login';
import { ME } from '../gql';
import { TitleClean } from '../Text';
import { useLogout } from '../hooks/useLogout';
import useTranslate from '../hooks/useTranslate';

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

    const { data } = useQuery(ME);

    const { me: user } = data || {};

    const loggedIn = !!user;
    const isDJ = user && user.isDj;

    return (
        <>
            <GlobalStyle />

            <BurgerButton
                className="mobileMenuButton link-look"
                onClick={() => {
                    setShow(true);
                }}
            >
                <h2>Menu</h2>
            </BurgerButton>

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

            <Popup showing={loginExpanded} onClickOutside={() => setLoginExpanded(false)}>
                <Login onLogin={() => setLoginExpanded(false)} />
            </Popup>
        </>
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
            <ClosePopupButton
                style={{ position: 'absolute', top: 10, right: 10 }}
                onClick={() => setShow(false)}
            />

            <div className="menu">
                <ul>
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
                                to={translate(appRoutes.becomeDj)}
                                label={translate('become-dj')}
                                important="true"
                            />
                        </li>
                    )}
                    {loggedIn ? null : (
                        <li>
                            <Navlink
                                onClick={() => setShow(false)}
                                to={translate(appRoutes.signUp)}
                                label={translate('sign up')}
                                important="true"
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

const BurgerButton = styled.button`
    backface-visibility: hidden;
    border-radius: 25px;
    cursor: pointer;
    display: none;
    height: 50px;
    min-height: 50px;
    min-width: 50px;
    position: absolute;
    right: 0px;
    top: 15px;
    width: 50px;

    @media only screen and (max-width: 767px) {
        display: block;
    }

    &:hover {
        color: hsla(0, 0%, 100%, 0.5);
    }
    h2,
    h2:before,
    h2:after {
        background: white;
        border-radius: 3px;
        height: 5px;
        position: absolute;
        transform: translate3d(0, 0, 0);
        width: 40px;
    }
    h2 {
        font-size: 0;
        left: 0px;
        top: 23px;
    }
    h2:before,
    h2:after {
        content: '';
        left: 0;
    }
    h2:before {
        top: -14px;
    }
    h2:after {
        top: 14px;
    }
`;

const GlobalStyle = createGlobalStyle`

        .mobileMenu a,
        .mobileMenu .link-look {
            color: #32325d;
            font-weight: 500;
            -webkit-tap-highlight-color: transparent;
            text-decoration: none;
            transition: color 0.1s;
        }

        .mobileMenu {
            backface-visibility: hidden;
            height: 100vh;
            overflow: scroll;
            padding: 4vw;
            pointer-events: none;
            position: absolute;
            width: 100vw;
            z-index: 2;
        }
        .mobileMenu .menuArea {
            backface-visibility: hidden;
            background: white;
            border-radius: 10px;
            box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1), 0 15px 35px rgba(50, 50, 93, 0.15),
                0 5px 15px rgba(0, 0, 0, 0.1);
            opacity: 0;
            padding: 20px;
            padding-bottom: 10px;
            position: relative;
            transform: rotate3d(1, 1, 0, -15deg);
            transform-origin: 100% 0;
            transition-duration: 0.35s;
            transition-property: transform, opacity, height;
            width: 100%;
            will-change: transform, opacity, height;
            z-index: 101;
        }

        .mobileMenu.active {
            pointer-events: all;
        }
        .mobileMenu.active .menuArea {
            opacity: 1;
            transform: none;
        }

        .mobileMenu .menu {
            align-items: center;
            /*height: 100%;*/
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .mobileMenu .menu li {
           height: 36px;
           break-inside: avoid;
        }
        .mobileMenu li  a,
        .mobileMenu li  button {
            font-size: 15px !important;
            text-transform: capitalize;
            line-height: 1em;
            height: 1em;
        }

        .popupCloseButton {
            cursor: pointer;
            font-size: 0 !important;
            height: 51px;
            position: absolute;
            right: 0;
            top: 0;
            width: 51px;
        }
        .popupCloseButton:before,
        .popupCloseButton:after {
            background: #31daff;
            border-radius: 1px;
            content: '';
            height: 3px;
            left: 14px;
            position: absolute;
            right: 14px;
            top: 24px;
            transform: rotate(45deg);
            transition: background 0.1s;
        }
        .popupCloseButton:after {
            transform: rotate(-45deg);
        }

        .mobileMenu .menu ul {
            column-count: 2;
            width: 100%;
        }

        .white-theme .mobileMenuButton h2,
        .white-theme .mobileMenuButton h2:after,
        .white-theme .mobileMenuButton h2:before {
            background: #32325d;
        }
        

`;

export default MobileMenu;
