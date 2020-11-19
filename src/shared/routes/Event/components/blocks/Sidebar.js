import React from 'react';
import { InlineIcon } from '@iconify/react';
import detailsIcon from '@iconify/icons-ion/ios-calendar';
import djOffersIcon from '@iconify/icons-ion/ios-person';

import reviewIcon from '@iconify/icons-ion/ios-star';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useLocation, useRouteMatch } from 'react-router';
import GreyBox from 'components/GreyBox';
import NavMenuButton from 'components/NavMenuButton';
import { Col, Hr, NotificationBubble, SecondaryButton } from 'components/Blocks';
import { BodySmall, H3, Title } from 'components/Text';

const CustomGreyBox = styled(GreyBox)`
    padding: 0;
    margin-bottom: 15px;
    .active ${NavMenuButton} {
        font-weight: 600;
    }
`;

const Sidebar = ({ theEvent }) => {
    const { name, start, end, location } = theEvent || {};

    const match = useRouteMatch();

    return (
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
                        <NavLink to={match.url + '/overview'}>
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
                        <NavLink to={match.url + '/requirements'}>
                            <NavMenuButton>
                                <InlineIcon icon={detailsIcon} />
                                Event details
                            </NavMenuButton>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to={match.url + '/review'}>
                            <NavMenuButton>
                                <InlineIcon icon={reviewIcon} />
                                Review DJ
                            </NavMenuButton>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </CustomGreyBox>
    );
};

export default Sidebar;
