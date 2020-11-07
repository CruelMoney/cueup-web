import React from 'react';
import { InlineIcon } from '@iconify/react';
import opportunitiesIcon from '@iconify/icons-ion/ios-flash';
import directRequestsIcon from '@iconify/icons-ion/ios-person';
import archivedIcon from '@iconify/icons-ion/ios-trash';
import upcomingIcon from '@iconify/icons-ion/ios-calendar';
import completedIcon from '@iconify/icons-ion/md-checkmark';
import inProgressIcon from '@iconify/icons-ion/ios-clock-outline';
import styled from 'styled-components';
import GreyBox from 'components/GreyBox';
import NavMenuButton from 'components/NavMenuButton';
import { Hr } from 'components/Blocks';

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

const Sidebar = () => {
    return (
        <GreyBox style={{ maxWidth: 300, width: 300, padding: 0 }}>
            <nav>
                <ul style={{ margin: '0.5em 0' }}>
                    <li style={{ padding: '0.5em' }}>
                        <h5>Gigs</h5>
                    </li>

                    <li>
                        <NavMenuButton>
                            <InlineIcon icon={directRequestsIcon} />
                            Direct requests
                            <NotificationBubble>
                                <span>1</span>
                            </NotificationBubble>
                        </NavMenuButton>
                    </li>
                    <li>
                        <NavMenuButton>
                            <InlineIcon icon={opportunitiesIcon} />
                            Opportunities
                            <NotificationBubble>
                                <span>6</span>
                            </NotificationBubble>
                        </NavMenuButton>
                    </li>
                    <Hr style={{ margin: '0.5em 0' }} />

                    <li>
                        <NavMenuButton>
                            <InlineIcon icon={inProgressIcon} />
                            Unconfirmed
                            <NotificationBubble>
                                <span>1</span>
                            </NotificationBubble>
                        </NavMenuButton>
                    </li>

                    <li>
                        <NavMenuButton>
                            <InlineIcon icon={upcomingIcon} />
                            Upcoming
                            <NotificationBubble>
                                <span>1</span>
                            </NotificationBubble>
                        </NavMenuButton>
                    </li>

                    <Hr style={{ margin: '0.5em 0' }} />

                    <li>
                        <NavMenuButton>
                            <InlineIcon icon={completedIcon} />
                            Completed
                        </NavMenuButton>
                    </li>

                    <li>
                        <NavMenuButton>
                            <InlineIcon icon={archivedIcon} />
                            Archived
                        </NavMenuButton>
                    </li>
                </ul>
            </nav>
        </GreyBox>
    );
};

export default Sidebar;
