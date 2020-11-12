import React from 'react';
import { Icon } from '@iconify/react';
import mailIcon from '@iconify/icons-ion/mail';
import phoneIcon from '@iconify/icons-ion/call';
import chatIcon from '@iconify/icons-ion/chatbubble';

import { useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOG_ACTIVITY } from 'routes/User/gql';
import { ACTIVITY_TYPES } from 'components/hooks/useLogActivity';
import ConditionalWrap from '../../../../components/ConditionalWrap';
import { RowMobileCol, RowWrap, SecondaryButton, SmartButton } from '../../../../components/Blocks';

const ContactPills = ({ gigId, email, phone, showInfo, openChat }) => {
    const match = useRouteMatch();

    const [log] = useMutation(LOG_ACTIVITY, {
        onError: console.log,
    });

    const handleShow = ({ value, type, message }) => {
        log({
            variables: {
                type,
                subjectId: gigId,
            },
        });
        window.prompt(message, value);
    };
    return (
        <RowMobileCol>
            {email && (
                <ConditionalWrap
                    condition={showInfo}
                    wrap={(children) => (
                        <button
                            onClick={() =>
                                handleShow({
                                    message: '',
                                    value: email,
                                    type: ACTIVITY_TYPES.GIG_EMAIL,
                                })
                            }
                        >
                            {children}
                        </button>
                    )}
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
                    wrap={(children) => (
                        <button
                            onClick={() =>
                                handleShow({
                                    message: '',
                                    value: phone,
                                    type: ACTIVITY_TYPES.GIG_CALL,
                                })
                            }
                        >
                            {children}
                        </button>
                    )}
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
        </RowMobileCol>
    );
};

export default ContactPills;
