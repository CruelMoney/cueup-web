import React, { useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';

const StyledNav = styled.nav`
    height: 48px;
    border-top: 2px solid #ebebeb40;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;

    @media only screen and (max-width: 425px) {
        width: 100vw;
        margin-left: -15px;
        padding: 0 15px;
    }
`;

const Filler = styled.span`
    @media only screen and (max-width: 990px) {
        display: none;
    }
`;

const StyledLink = styled(NavLink)`
    font-size: 18px;
    height: 48px;
    line-height: 48px;
    color: #ffffff !important;
    letter-spacing: 0.0666em;
    text-align: left;
    text-transform: uppercase;
    font-weight: 700;
    opacity: ${({ active }) => {
        return active ? 1 : 0.6;
    }};
    &:hover {
        opacity: 1;
        color: #ffffff;
    }
    @media only screen and (max-width: 990px) {
        font-size: 15px;
    }

    ${({ mobileOnly }) =>
        mobileOnly &&
        css`
            display: none;
            @media only screen and (max-width: 425px) {
                display: inline-block;
            }
        `}
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

const Navigation = (props) => {
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

    useEffect(resetIndicator, [routes, resetIndicator]);

    // change active indicator if navigated
    useEffect(() => {
        resetIndicator();
    }, [pathname, resetIndicator]);

    const fillers = new Array(7 - routes.length).fill(1);

    return (
        <StyledNav ref={navRef} onMouseLeave={resetIndicator} showMobile={showMobile}>
            <ActiveIndicator ref={indicator} />
            {routes.map(({ route, label }) => {
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
                        active={active ? 'true' : undefined}
                        data-cy={'navbutton-' + label}
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
};

export default withRouter(Navigation);
