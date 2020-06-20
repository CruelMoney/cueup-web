import React, { useState } from 'react';
import styled from 'styled-components';
import usePushNotifications from 'components/hooks/usePushNotifications';
import { Label, Value, Checkbox } from '../../../components/FormComponents';
import { Row, Col, Hr } from '../../../components/Blocks';

const TableRow = styled(Row)`
    height: 42px;
    align-items: center;
    p {
        margin-bottom: 0;
    }
    > *:first-child {
        flex: 1;
    }
    > *:nth-child(2),
    > *:nth-child(3),
    > *:nth-child(4) {
        min-width: 100px;
        text-align: center;
        justify-content: center;
    }
`;

const DJ_NOTIFICATION_TYPES = Object.freeze([
    'NEW_REQUEST',
    'OFFER_ACCEPTED',
    'EVENT_CANCELLED',
    'EVENT_UPDATED',
    'NEW_REVIEW',
    'NEW_MESSAGE',
]);
const ORGANIZER_NOTIFICATION_TYPES = Object.freeze(['NEW_OFFER', 'DJ_CANCELLED', 'NEW_MESSAGE']);

const CheckBoxRow = ({ label, email, push, browser, onChange }) => {
    return (
        <TableRow>
            <Value>{label}</Value>
            <Checkbox defaultValue={push} onChange={(val) => onChange('push')(val)} />
            <Checkbox defaultValue={email} onChange={(val) => onChange('email')(val)} />
            <Checkbox defaultValue={browser} onChange={(val) => onChange('browser')(val)} />
        </TableRow>
    );
};

const NotificationPreferences = ({ notifications, onSave, roles, userId }) => {
    const [internal, setInternal] = useState(notifications);
    const { showPrompt, pushShouldBeEnabled, loading, pushIsEnabled } = usePushNotifications({
        userId,
    });

    const onChange = (key) => (type) => (val) => {
        if (type === 'browser' && val && pushShouldBeEnabled) {
            showPrompt();
        }

        const newNotifications = {
            ...internal,
            [key]: {
                ...internal[key],
                [type]: val,
            },
        };
        setInternal(newNotifications);
        onSave(newNotifications);
    };

    return (
        <Col style={{ width: '100%', marginRight: '36px' }} key={loading}>
            <TableRow>
                <Label>Notifications</Label>
                <Label>Mobile</Label>
                <Label>Email</Label>
                <Label>Browser</Label>
            </TableRow>
            <Hr />

            {Object.entries(notifications)
                .filter(([key]) => {
                    let filter = [];
                    if (roles.includes('DJ')) {
                        filter = [...filter, ...DJ_NOTIFICATION_TYPES];
                    }
                    if (roles.includes('ORGANIZER')) {
                        filter = [...filter, ...ORGANIZER_NOTIFICATION_TYPES];
                    }

                    return filter.includes(key);
                })
                .map(([key, { label, email, push, browser = pushIsEnabled }]) => {
                    return (
                        <CheckBoxRow
                            key={key}
                            label={label}
                            email={email}
                            push={push}
                            browser={browser}
                            onChange={onChange(key)}
                        />
                    );
                })}
        </Col>
    );
};

export default NotificationPreferences;
