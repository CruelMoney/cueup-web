import React from 'react';
import { InlineIcon } from '@iconify/react';
import detailsIcon from '@iconify/icons-ion/ios-calendar';
import djOffersIcon from '@iconify/icons-ion/ios-person';

import reviewIcon from '@iconify/icons-ion/ios-star';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import GreyBox from 'components/GreyBox';
import NavMenuButton from 'components/NavMenuButton';
import { Col, Hr, NotificationBubble, SecondaryButton } from 'components/Blocks';
import { BodySmall, H3, Title } from 'components/Text';

const CustomGreyBox = styled(GreyBox)`
    padding: 0;
    .active ${NavMenuButton} {
        font-weight: 600;
    }
`;

const Sidebar = ({ theEvent }) => {
    const { name, start, end, location } = theEvent || {};

    return (
        <CustomCol>
            <CustomGreyBox>
                <Col style={{ padding: '1em 1em 0' }}>
                    <H3 small dark>
                        {name}
                    </H3>
                    <BodySmall style={{ margin: 0 }}>{location?.name}</BodySmall>
                    <BodySmall style={{ margin: 0 }}>{start?.formattedDate}</BodySmall>
                    <BodySmall style={{ margin: 0 }}>
                        {start?.formattedTime}
                        {' to '}
                        {end?.formattedTime}
                    </BodySmall>
                </Col>

                <Hr style={{ margin: '15px 0' }} />

                <nav>
                    <ul style={{ margin: '0.5em 0' }}>
                        <li>
                            <NavLink to="overview">
                                <NavMenuButton>
                                    <InlineIcon icon={djOffersIcon} />
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
                                    <InlineIcon icon={detailsIcon} />
                                    Event details
                                </NavMenuButton>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="review">
                                <NavMenuButton>
                                    <InlineIcon icon={reviewIcon} />
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
    min-width: 300px;
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
