import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';

import { Row, TeritaryButton, SmartButton } from '../../../../components/Blocks';

import { Body, Title } from '../../../../components/Text';

import { EVENT_REFUND, CANCEL_EVENT } from '../../gql';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import CheckboxTable from '../../../../components/CheckboxTable';

const CancelationPopup = ({ theEvent, hide, onCancelled }) => {
    const [reason, setReason] = useState();
    const [mutate, { loading: cancelling }] = useMutation(CANCEL_EVENT, {
        variables: {
            reason,
            id: theEvent.id,
            hash: theEvent.hash,
        },
        onCompleted: () => {
            onCancelled();
        },
    });

    const cancel = () => {
        if (!reason) {
            window.alert('Please select a reason for cancelling');
            return;
        }
        mutate();
    };

    const { loading, data } = useQuery(EVENT_REFUND, {
        variables: {
            id: theEvent.id,
            hash: theEvent.hash,
        },
    });

    if (loading) {
        return <LoadingPlaceholder2 />;
    }

    const {
        event: { chosenGig },
    } = data;

    return (
        <div>
            <Title>Cancel event</Title>
            <Body>
                Are you sure you want to cancel? Please let us know the reason for canceling and if
                we can do anything better.
            </Body>

            <CheckboxTable
                style={{ marginTop: '42px', marginBottom: '42px' }}
                options={{
                    0: {
                        label: 'The event is cancelled',
                    },
                    1: {
                        label: 'The DJ asked me to cancel',
                    },
                    2: {
                        label: 'We found a DJ somewhere else',
                    },
                    3: {
                        label: 'We actually don’t need a DJ',
                    },
                }}
                onSave={setReason}
            />
            {chosenGig && chosenGig.offer && <CancelationConsequences offer={chosenGig.offer} />}
            <Row style={{ marginTop: '42px' }} right>
                <TeritaryButton type="button" onClick={hide}>
                    Keep event
                </TeritaryButton>
                <SmartButton
                    warning
                    loading={cancelling}
                    level="secondary"
                    onClick={() => cancel()}
                >
                    Cancel event
                </SmartButton>
            </Row>
        </div>
    );
};

const CancelationConsequences = ({ offer }) => {
    const {
        daysLeftInCancelationPolicy,
        isWithinCancelationPolicy,
        bestCaseRefund,
        worstCaseRefund,
    } = offer;

    if (isWithinCancelationPolicy) {
        return (
            <Body>
                Cancel now or within <b>{daysLeftInCancelationPolicy} days</b>, and receive a refund
                of <b>{bestCaseRefund.formatted}</b> otherwise you’ll recieve a refund of{' '}
                {<b>{worstCaseRefund.formatted}</b>}.
            </Body>
        );
    }

    return (
        <Body>
            Cancel now and receive a refund of <b>{worstCaseRefund.formatted}</b>.
        </Body>
    );
};

export default CancelationPopup;
