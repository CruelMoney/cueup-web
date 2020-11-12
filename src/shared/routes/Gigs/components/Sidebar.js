import React from 'react';
import { InlineIcon } from '@iconify/react';
import opportunitiesIcon from '@iconify/icons-ion/ios-search-strong';
import directRequestsIcon from '@iconify/icons-ion/ios-person';
import archivedIcon from '@iconify/icons-ion/ios-trash';
import upcomingIcon from '@iconify/icons-ion/ios-calendar';
import completedIcon from '@iconify/icons-ion/ios-checkmark-circle-outline';
import inProgressIcon from '@iconify/icons-ion/ios-chatbubbles';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import GreyBox from 'components/GreyBox';
import NavMenuButton from 'components/NavMenuButton';
import { Col, Hr, NotificationBubble, SecondaryButton } from 'components/Blocks';
import usePushNotifications from 'components/hooks/usePushNotifications';
import { BodySmall, Title } from 'components/Text';
import { useMyActiveGigs } from 'components/hooks/useMyActiveGigs';
import { gigStates } from 'constants/constants';

const CustomGreyBox = styled(GreyBox)`
    padding: 0;
    .active ${NavMenuButton} {
        font-weight: 600;
    }
`;

const EnableNotifications = ({ userId }) => {
    const { pushShouldBeEnabled, showPrompt } = usePushNotifications({ userId });

    if (!pushShouldBeEnabled) {
        return null;
    }

    return (
        <div>
            <Title>Never miss a gig</Title>
            <BodySmall>Enable desktop notifications when getting new gigs or messages.</BodySmall>
            <SecondaryButton onClick={showPrompt} style={{ marginTop: '12px' }}>
                Enable notifications
            </SecondaryButton>
        </div>
    );
};

const Sidebar = ({ user }) => {
    const {
        [gigStates.REQUESTED]: requestedCount,
        opportunities: opportunitiesCount,
    } = useMyActiveGigs();

    return (
        <CustomCol>
            <CustomGreyBox>
                <nav>
                    <ul style={{ margin: '0.5em 0' }}>
                        <li style={{ padding: '0.5em' }}>
                            <h5>Gigs</h5>
                        </li>

                        <li>
                            <NavLink to="/u/gigs/direct-requests">
                                <NavMenuButton>
                                    <InlineIcon icon={directRequestsIcon} />
                                    Direct requests
                                    {!!requestedCount && (
                                        <NotificationBubble>
                                            <span>{requestedCount}</span>
                                        </NotificationBubble>
                                    )}
                                </NavMenuButton>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/u/gigs/opportunities">
                                <NavMenuButton>
                                    <InlineIcon icon={opportunitiesIcon} />
                                    Opportunities
                                    {!!opportunitiesCount && (
                                        <NotificationBubble>
                                            <span>{opportunitiesCount}</span>
                                        </NotificationBubble>
                                    )}
                                </NavMenuButton>
                            </NavLink>
                        </li>
                        <Hr style={{ margin: '0.5em 0' }} />

                        <li>
                            <NavLink to="/u/gigs/unconfirmed">
                                <NavMenuButton>
                                    <InlineIcon icon={inProgressIcon} />
                                    Unconfirmed
                                </NavMenuButton>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/u/gigs/upcoming">
                                <NavMenuButton>
                                    <InlineIcon icon={upcomingIcon} />
                                    Upcoming
                                </NavMenuButton>
                            </NavLink>
                        </li>

                        <Hr style={{ margin: '0.5em 0' }} />

                        <li>
                            <NavLink to="/u/gigs/completed">
                                <NavMenuButton>
                                    <InlineIcon icon={completedIcon} />
                                    Completed
                                </NavMenuButton>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/u/gigs/archived">
                                <NavMenuButton>
                                    <InlineIcon icon={archivedIcon} />
                                    Archived
                                </NavMenuButton>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </CustomGreyBox>
            {user && <EnableNotifications userId={user.id} />}
        </CustomCol>
    );
};

const CustomCol = styled(Col)`
    max-width: 300px;
    width: 300px;
    margin-right: 30px;
    position: sticky;
    top: 15px;
    @media only screen and (max-width: 1200px) {
        max-width: auto;
        width: auto;
    }
    @media only screen and (max-width: 716px) {
        position: relative;
        max-width: 100%;
        width: 100%;
        margin-top: -15px;
        margin-bottom: 15px;
        margin-right: 0px;
    }
`;

export default Sidebar;
