import React, { useRef, useLayoutEffect, useContext, useEffect, memo, useCallback } from 'react';
import styled from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';
import { MobileMenuContext } from './MobileMenu';

const StyledNav = styled.nav`
    height: 48px;
    border-top: 2px solid #ebebeb40;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;

    @media only screen and (max-width: 425px) {
        display: ${({ showMobile }) => (showMobile ? 'flex' : 'none')};
    }
`;

const Filler = styled.span`
    @media only screen and (max-width: 900px) {
        display: none;
    }
`;

const StyledLink = styled(({ indicateActive, ...rest }) => <NavLink {...rest} />)`
    font-size: 18px;
    height: 48px;
    line-height: 48px;
    color: #ffffff !important;
    letter-spacing: 0.0666em;
    text-align: left;
    text-transform: uppercase;
    font-family: 'AvenirNext-Bold', Arial, Helvetica, sans-serif;
    opacity: ${({ indicateActive }) => {
        return indicateActive ? 1 : 0.6;
    }};
    &:hover {
        opacity: 1;
        color: #ffffff;
    }
    @media only screen and (max-width: 900px) {
        font-size: 15px;
    }
`;

const ActiveIndicator = styled.span`
    height: 2px;
    background: #ffffff;
    position: absolute;
    top: -2px;
    left: 0;
    width: 1px;
    transform-origin: left;
    transition: transform 200ms cubic-bezier(0.075, 0.82, 0.165, 1);
`;

const Navigation = memo((props) => {
    const { routes, location, registerRoutes, unregisterRoutes, showMobile } = props;
    const { pathname } = location;
    const navRef = useRef();
    const activeRef = useRef();
    const indicator = useRef();

    const setActiveIndicatorFromElement = (el) => {
        if (el) {
            const { left: navLeft } = navRef.current.getBoundingClientRect();
            const { left, width } = el.getBoundingClientRect();

            indicator.current.style.transform = `translateX(${left - navLeft}px) scaleX(${width})`;
        }
    };

    const resetIndicator = useCallback(() => {
        setActiveIndicatorFromElement(activeRef.current);
    }, []);

    useEffect(() => {
        registerRoutes(routes);
        return () => {
            unregisterRoutes(routes);
        };
    }, [routes, registerRoutes, unregisterRoutes]);

    useLayoutEffect(resetIndicator, [routes]);

    // change active indicator if navigated
    useEffect(() => {
        resetIndicator();
    }, [pathname, resetIndicator]);

    const fillers = new Array(7 - routes.length).fill(1);

    return (
        <StyledNav ref={navRef} onMouseLeave={resetIndicator} showMobile={showMobile}>
            <ActiveIndicator ref={indicator} />
            {routes.map(({ route, label, className }) => {
                const active = pathname.includes(route);
                return (
                    <StyledLink
                        exact
                        key={route}
                        to={{
                            pathname: route,
                            search: location.search,
                            state: location.state,
                        }}
                        innerRef={(r) => {
                            if (active) {
                                activeRef.current = r;
                            }
                        }}
                        onMouseEnter={({ target }) => setActiveIndicatorFromElement(target)}
                        indicateActive={active}
                        className={className}
                    >
                        {label}
                    </StyledLink>
                );
            })}
            {fillers.map((v, idx) => (
                <Filler key={idx} />
            ))}
        </StyledNav>
    );
});

const Wrapper = (props) => {
    const { registerRoutes, unregisterRoutes } = useContext(MobileMenuContext);

    return (
        <Navigation
            {...props}
            registerRoutes={registerRoutes}
            unregisterRoutes={unregisterRoutes}
        />
    );
};

export default withRouter(Wrapper);
