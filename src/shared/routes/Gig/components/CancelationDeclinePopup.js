import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import { useMutation } from '@apollo/client';

import { Row, TeritaryButton, SmartButton } from '../../../components/Blocks';
import { gigStates } from '../../../constants/constants';
import { Title, Body } from '../../../components/Text';
import CheckboxTable from '../../../components/CheckboxTable';
import Popup from '../../../components/common/Popup';

import { DECLINE_GIG, CANCEL_GIG } from '../gql.js';

const CancelationDeclinePopup = ({ gig, hide, onCancelled }) => {
    const [reason, setReason] = useState(null);

    const { status } = gig || {};

    const isCancel = status === gigStates.CONFIRMED;
    const mutation = isCancel ? CANCEL_GIG : DECLINE_GIG;

    const [mutate, { loading: cancelling }] = useMutation(mutation, {
        variables: {
            reason,
            id: gig?.id,
        },
        onCompleted: () => {
            if (onCancelled) {
                onCancelled();
            }
        },
    });

    const doMutate = () => {
        if (!reason) {
            window.alert('Please select a reason');
            return;
        }
        mutate();
    };

    const cancelText =
        'All money will be refunded to the organizer. \nPlease let us know the reason for cancelling and if we can do anything better.';
    const declineText =
        'Please let us know the reason for declining so we can get you better gigs in the future.';

    const declineOptions = {
        0: {
            label: "I can't play that day",
        },
        1: {
            label: 'The gig is out of my area',
        },
        2: {
            label: "I don't have the required equipment",
        },
        3: {
            label: 'The gig is not my style',
        },
        4: {
            label: 'I feel overqualified',
        },
        5: {
            label: 'I feel underqualified',
        },
        6: {
            label: 'The budget is too small',
        },
    };

    const cancelOptions = {
        0: {
            label: "I can't play that day",
        },
        1: {
            label: 'The organizer changed the requirements',
        },
        2: {
            label: "I don't feel comfortable playing this gig",
        },
    };

    return (
        <Popup width={530} showing onClickOutside={hide}>
            <Title>{isCancel ? 'Cancel' : 'Decline'} gig</Title>
            <Body>{isCancel ? cancelText : declineText}</Body>

            <CheckboxTable
                style={{ marginTop: '42px', marginBottom: '42px' }}
                options={isCancel ? cancelOptions : declineOptions}
                onSave={setReason}
            />

            <Row style={{ marginTop: '42px' }} right>
                <TeritaryButton type="button" onClick={hide}>
                    Keep gig
                </TeritaryButton>
                <SmartButton
                    warning
                    loading={cancelling}
                    level="secondary"
                    onClick={() => doMutate()}
                >
                    {isCancel ? 'Cancel gig' : 'Decline gig'}
                </SmartButton>
            </Row>
        </Popup>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default CancelationDeclinePopup;
