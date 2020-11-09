import React from 'react';
import { Icon } from '@iconify/react';
import mailIcon from '@iconify/icons-ion/mail';
import phoneIcon from '@iconify/icons-ion/call';
import chatIcon from '@iconify/icons-ion/chatbubble';

import { useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import ConditionalWrap from '../../../../components/ConditionalWrap';
import { InfoPill } from '../../../../components/Blocks';

const hiddenEmail = '12345678@1234'.replace(/\w/g, '•') + '.com';
const hiddenNumber = '45 12 34 56 78'.replace(/\w/g, '•');

const ContactPills = ({ email, phone, showInfo, openChat }) => {
    const match = useRouteMatch();

    return (
        <>
            {email && (
                <ConditionalWrap
                    condition={showInfo}
                    wrap={(children) => <a href={'mailto:' + email}>{children}</a>}
                    elseWrap={(children) => (
                        <NavLink to={match.url + '/contact-get-pro'}>{children}</NavLink>
                    )}
                >
                    <InfoPill active={showInfo}>
                        <Icon icon={mailIcon} style={{ fontSize: '15px' }} />{' '}
                        <span>{showInfo ? email : hiddenEmail}</span>
                    </InfoPill>
                </ConditionalWrap>
            )}
            {phone && (
                <ConditionalWrap
                    condition={showInfo}
                    wrap={(children) => <a href={'tel:' + phone}>{children}</a>}
                    elseWrap={(children) => (
                        <NavLink to={match.url + '/contact-get-pro'}>{children}</NavLink>
                    )}
                >
                    <InfoPill active={showInfo}>
                        <Icon icon={phoneIcon} style={{ fontSize: '15px' }} />{' '}
                        <span>{showInfo ? phone : hiddenNumber}</span>
                    </InfoPill>
                </ConditionalWrap>
            )}
            <InfoPill active onClick={openChat} style={{ cursor: 'pointer' }}>
                <Icon icon={chatIcon} style={{ fontSize: '15px' }} /> <span>Send message</span>
            </InfoPill>
        </>
    );
};

export default ContactPills;
