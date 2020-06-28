import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Icon, InlineIcon } from '@iconify/react';
import chatbubbleEllipsesOutline from '@iconify/icons-ion/chatbubble-ellipses-outline';
import helpIcon from '@iconify/icons-ion/help-circle-outline';
import logoutIcon from '@iconify/icons-simple-line-icons/logout';
import settingsOutline from '@iconify/icons-ion/settings-outline';
import starOutline from '@iconify/icons-ion/star-outline';
import personOutline from '@iconify/icons-ion/person-outline';
import musicalNotesOutline from '@iconify/icons-ion/musical-notes-outline';
import calendarOutline from '@iconify/icons-ion/calendar-outline';
import { useLocation } from 'react-router';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import NavLink from 'components/common/Navlink';
import { TeritaryButton } from 'components/Blocks';
import { showOlark } from 'utils/olark';
import UserRoute from '../../routes/User';
import { useLogout } from '../hooks/useLogout';
import UserMenuItem from './UserMenuItem';

const DesktopMenu = (props) => {
    const [showing, setShowing] = useState();
    const node = useRef();
    const location = useLocation();

    useEffect(() => {
        const handleClick = (e) => {
            if (node.current.contains(e.target)) {
                setShowing(true);
                UserRoute.preload();
            } else {
                setShowing(false);
            }
        };
        document.addEventListener('click', handleClick);

        return () => document.removeEventListener('click', handleClick);
    }, []);

    // hide on navigate
    useEffect(() => {
        setShowing(false);
    }, [location]);

    return (
        <Wrapper ref={node} className={showing ? 'white-bg' : ''}>
            <UserMenuItem {...props} />
            {showing && <DropDownMenu {...props} />}
        </Wrapper>
    );
};

const MenuButton = styled(TeritaryButton)`
    text-align: left;
    color: #32325d;
    font-weight: 300;
    font-size: 16px;
    width: 100%;
    max-width: 100%;
    transition: none;
    border-radius: 12px;
    line-height: 24px;
    display: flex;
    align-items: center;

    > svg {
        margin-right: 0.5em;
        margin-left: -0.5em;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 0.15em;
        height: 24px;
        width: 24px;
        border-radius: 6px;
    }
`;

const DropDownMenu = ({ user, ...props }) => {
    const { t } = useTranslate();
    const logout = useLogout();

    const isPro = user.appMetadata.isPro;
    const isOrganizer = user.appMetadata.roles.includes('ORGANIZER');
    const isDJ = user.appMetadata.roles.includes('DJ');

    const typeformUrl = isDJ
        ? 'https://cueup.typeform.com/to/u8Oec7'
        : 'https://cueup.typeform.com/to/ioEkiJ';

    return (
        <>
            <MenuList>
                <li>
                    <NavLink
                        to={t(appRoutes.user) + '/' + user.permalink}
                        data-cy="menu-profile-link"
                    >
                        <UserMenuItem isInMenu {...{ user, ...props }} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={t(appRoutes.userOverview).replace(':permalink', user.permalink)}>
                        <MenuButton>
                            <InlineIcon icon={personOutline} />
                            Profile
                        </MenuButton>
                    </NavLink>
                </li>

                {isDJ && (
                    <li>
                        <NavLink to={t(appRoutes.userGigs).replace(':permalink', user.permalink)}>
                            <MenuButton>
                                <InlineIcon icon={musicalNotesOutline} />
                                Gigs
                            </MenuButton>
                        </NavLink>
                    </li>
                )}
                {isOrganizer && (
                    <li>
                        <NavLink to={t(appRoutes.userEvents).replace(':permalink', user.permalink)}>
                            <MenuButton>
                                <InlineIcon icon={calendarOutline} />
                                Events
                            </MenuButton>
                        </NavLink>
                    </li>
                )}
                <li>
                    <NavLink to={t(appRoutes.userSettings).replace(':permalink', user.permalink)}>
                        <MenuButton>
                            <InlineIcon icon={settingsOutline} />
                            Settings
                        </MenuButton>
                    </NavLink>
                </li>
                {!isPro && (
                    <li>
                        <NavLink
                            to={
                                t(appRoutes.userSettings).replace(':permalink', user.permalink) +
                                '/get-pro'
                            }
                        >
                            <MenuButton>
                                <InlineIcon icon={starOutline} />
                                Go Pro
                            </MenuButton>
                        </NavLink>
                    </li>
                )}
                <hr />
                <li>
                    <a className="navLink" href={typeformUrl} target="_blank" rel="noreferrer">
                        <MenuButton>
                            <InlineIcon icon={chatbubbleEllipsesOutline} />
                            Give Feedback
                        </MenuButton>
                    </a>
                </li>
                <li>
                    <MenuButton onClick={showOlark}>
                        <InlineIcon icon={helpIcon} />
                        Help!?
                    </MenuButton>
                </li>
                <li>
                    <NavLink to={t(appRoutes.home)} onClick={logout} activeClassName="">
                        <MenuButton>
                            <InlineIcon icon={logoutIcon} style={{ padding: '0.25em' }} />
                            {t('log-out')}
                        </MenuButton>
                    </NavLink>
                </li>
            </MenuList>
        </>
    );
};

const MenuList = styled.ul`
    position: absolute;
    top: -1em;
    left: -1em;
    background-color: white;
    right: -1em;
    padding: 1em;
    padding-top: 1em;
    border-radius: 6px;
    text-align: left;
    z-index: 1;
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028),
        0 12.5px 10px rgba(0, 0, 0, 0.035), 0 22.3px 17.9px rgba(0, 0, 0, 0.042),
        0 41.8px 33.4px rgba(0, 0, 0, 0.05), 0 100px 80px rgba(0, 0, 0, 0.07);
    .navLink {
        color: #32325d;
        font-weight: 300;
        text-align: left;
        text-decoration: none !important;
        height: auto;
    }
    li {
    }
    li:first-child {
        margin-bottom: 1em;
    }
    hr {
        margin: 0.5em 0;
    }

    .active ${MenuButton} {
        font-weight: 600;
        background: #f6f8f9;
    }
`;

const Wrapper = styled.div`
    position: relative;
    /* color: white;
    fill: white; */

    &.white-bg a {
        color: #32325d;
        fill: #32325d;
    }
`;

export default DesktopMenu;
