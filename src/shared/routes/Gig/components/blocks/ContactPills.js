import React from 'react';
import { Icon } from '@iconify/react';
import mailIcon from '@iconify/icons-ion/mail';
import phoneIcon from '@iconify/icons-ion/call';
import chatIcon from '@iconify/icons-ion/chatbubble';

import { useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import ConditionalWrap from '../../../../components/ConditionalWrap';
import { InfoPill, RowWrap, SecondaryButton, SmartButton } from '../../../../components/Blocks';

const hiddenEmail = '12345678@1234'.replace(/\w/g, '•') + '.com';
const hiddenNumber = '45 12 34 56 78'.replace(/\w/g, '•');

const ContactPills = ({ email, phone, showInfo, openChat }) => {
    const match = useRouteMatch();

    return (
        <RowWrap>
            {email && (
                <ConditionalWrap
                    condition={showInfo}
                    wrap={(children) => <a href={'mailto:' + email}>{children}</a>}
                    elseWrap={(children) => (
                        <NavLink to={match.url + '/contact-get-pro'}>{children}</NavLink>
                    )}
                >
                    <SecondaryButton>
                        <Icon icon={mailIcon} style={{ marginBottom: -2, marginRight: 12 }} />
                        <span>Show email</span>
                    </SecondaryButton>
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
                    <SecondaryButton>
                        <Icon icon={phoneIcon} style={{ marginBottom: -2, marginRight: 12 }} />
                        <span>Show number</span>
                    </SecondaryButton>
                </ConditionalWrap>
            )}
            <SmartButton level={'primary'} onClick={openChat}>
                <Icon icon={chatIcon} style={{ marginBottom: -2, marginRight: 12 }} />
                <span>Send message</span>
            </SmartButton>
        </RowWrap>
    );
};

export default ContactPills;
