import React from 'react';
import { InlineIcon } from '@iconify/react';
import opportunitiesIcon from '@iconify/icons-ion/ios-flash';
import directRequestsIcon from '@iconify/icons-ion/ios-person';
import archivedIcon from '@iconify/icons-ion/ios-trash';
import upcomingIcon from '@iconify/icons-ion/ios-calendar';
import completedIcon from '@iconify/icons-ion/md-checkmark';
import inProgressIcon from '@iconify/icons-ion/ios-clock-outline';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import GreyBox from 'components/GreyBox';
import NavMenuButton from 'components/NavMenuButton';
import { Col, Hr, SecondaryButton } from 'components/Blocks';
import usePushNotifications from 'components/hooks/usePushNotifications';
import { BodySmall, Title } from 'components/Text';

const NotificationBubble = styled.span`
    background: rgb(244, 67, 54);
    border-radius: 50%;
    color: #fff;
    height: 1.5em;
    width: 1.5em;
    font-size: 0.8em;
    text-align: center;
    line-height: 1.5em;
    font-weight: 500;
    margin-left: 1em;
`;

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
    return (
        <Col style={{ maxWidth: 300, width: 300, marginRight: 60, position: 'sticky', top: 15 }}>
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
                                </NavMenuButton>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/u/gigs/opportunities">
                                <NavMenuButton>
                                    <InlineIcon icon={opportunitiesIcon} />
                                    Opportunities
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
        </Col>
    );
};

export default Sidebar;
