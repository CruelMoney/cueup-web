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

const Sidebar = ({ user }) => {
    return (
        <CustomCol>
            <CustomGreyBox>
                <nav>
                    <ul style={{ margin: '0.5em 0' }}>
                        <li>
                            <NavLink to="overview">
                                <NavMenuButton>
                                    <InlineIcon icon={directRequestsIcon} />
                                    DJ offers
                                    {/* {!!requestedCount && (
                                        <NotificationBubble>
                                            <span>{requestedCount}</span>
                                        </NotificationBubble>
                                    )} */}
                                </NavMenuButton>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="requirements">
                                <NavMenuButton>
                                    <InlineIcon icon={opportunitiesIcon} />
                                    Event requirements
                                </NavMenuButton>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="review">
                                <NavMenuButton>
                                    <InlineIcon icon={inProgressIcon} />
                                    Review DJ
                                </NavMenuButton>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </CustomGreyBox>
        </CustomCol>
    );
};

const CustomCol = styled(Col)`
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
