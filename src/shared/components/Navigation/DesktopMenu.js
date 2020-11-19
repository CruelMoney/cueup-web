import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { InlineIcon } from '@iconify/react';
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
import { Hr, NotificationBubble } from 'components/Blocks';
import { showSupportChat } from 'utils/supportChat';
import NavMenuButton from 'components/NavMenuButton';
import { useMyActiveGigs } from 'components/hooks/useMyActiveGigs';
import { gigStates } from 'constants/constants';
import UserRoute from '../../routes/User';
import { useLogout } from '../hooks/useLogout';
import UserMenuItem from './UserMenuItem';

const DesktopMenu = (props) => {
    const { user } = props;
    const [showing, setShowing] = useState();
    const node = useRef();
    const location = useLocation();

    const isPro = user.appMetadata.isPro;
    const isOrganizer = user.appMetadata.roles.includes('ORGANIZER');
    const isDJ = user.appMetadata.roles.includes('DJ');

    const {
        [gigStates.REQUESTED]: requestedCount,
        opportunities: opportunitiesCount,
    } = useMyActiveGigs({
        skip: !isDJ,
    });

    const totalNew = requestedCount + opportunitiesCount;

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
            <UserMenuItem
                {...props}
                notifications={totalNew}
                isPro={isPro}
                isDJ={isDJ}
                isOrganizer={isOrganizer}
            />
            {showing && (
                <DropDownMenu
                    {...props}
                    totalNew={totalNew}
                    isPro={isPro}
                    isDJ={isDJ}
                    isOrganizer={isOrganizer}
                />
            )}
        </Wrapper>
    );
};

const DropDownMenu = ({ user, isDJ, isOrganizer, isPro, totalNew, ...props }) => {
    const { t } = useTranslate();
    const logout = useLogout();

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
                {isDJ && (
                    <li>
                        <NavLink
                            to={t(appRoutes.userOverview).replace(':permalink', user.permalink)}
                        >
                            <NavMenuButton>
                                <InlineIcon icon={personOutline} />
                                Profile
                            </NavMenuButton>
                        </NavLink>
                    </li>
                )}

                {isDJ && <GigsMenuItem totalNew={totalNew} t={t} />}
                {isOrganizer && (
                    <li>
                        <NavLink to={t(appRoutes.userEvents)} data-cy="menu-events-link">
                            <NavMenuButton>
                                <InlineIcon icon={calendarOutline} />
                                Events
                            </NavMenuButton>
                        </NavLink>
                    </li>
                )}
                <li>
                    <NavLink to={t(appRoutes.userSettings)} data-cy="menu-settings-link">
                        <NavMenuButton>
                            <InlineIcon icon={settingsOutline} />
                            Settings
                        </NavMenuButton>
                    </NavLink>
                </li>
                {!isPro && isDJ && (
                    <li>
                        <NavLink to={t(appRoutes.userSettings) + '/get-pro'}>
                            <NavMenuButton>
                                <InlineIcon icon={starOutline} />
                                Go Pro
                            </NavMenuButton>
                        </NavLink>
                    </li>
                )}
                <Hr />
                <li>
                    <a className="navLink" href={typeformUrl} target="_blank" rel="noreferrer">
                        <NavMenuButton>
                            <InlineIcon icon={chatbubbleEllipsesOutline} />
                            Give Feedback
                        </NavMenuButton>
                    </a>
                </li>
                <li>
                    <NavMenuButton onClick={showSupportChat}>
                        <InlineIcon icon={helpIcon} />
                        Help!?
                    </NavMenuButton>
                </li>
                <li>
                    <NavLink to={t(appRoutes.home)} onClick={logout} activeClassName="">
                        <NavMenuButton>
                            <InlineIcon icon={logoutIcon} style={{ padding: '0.25em' }} />
                            {t('log-out')}
                        </NavMenuButton>
                    </NavLink>
                </li>
            </MenuList>
        </>
    );
};

const GigsMenuItem = ({ t, totalNew }) => {
    return (
        <li>
            <NavLink to={t(appRoutes.userGigs)} data-cy="menu-gigs-link">
                <NavMenuButton>
                    <InlineIcon icon={musicalNotesOutline} />
                    Gigs{' '}
                    {!!totalNew && (
                        <NotificationBubble>
                            <span>{totalNew}</span>
                        </NotificationBubble>
                    )}
                </NavMenuButton>
            </NavLink>
        </li>
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
    min-width: 200px;
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028),
        0 12.5px 10px rgba(0, 0, 0, 0.035), 0 22.3px 17.9px rgba(0, 0, 0, 0.042),
        0 41.8px 33.4px rgba(0, 0, 0, 0.05), 0 100px 80px rgba(0, 0, 0, 0.07);
    .navLink {
        color: #32325d;
        font-weight: 400;
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

    .active ${NavMenuButton} {
        font-weight: 600;
        background: #f6f8f9;
    }
    @media only screen and (max-width: 550px) {
        left: initial;
        right: 0em;
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
