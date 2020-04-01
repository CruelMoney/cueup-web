import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import emailValidator from 'email-validator';
import useTranslate from 'components/hooks/useTranslate';
import { Col, Row, TeritaryButton, SmartButton } from '../../../../components/Blocks';
import { SettingsSection, Input } from '../../../../components/FormComponents';

import SavingIndicator from '../../../../components/SavingIndicator';
import TextAreaPopup from '../../../../components/TextAreaPopup';
import { Body, Title } from '../../../../components/Text';
import GenreSelector from '../../../../components/GenreSelector';
import PhoneInput from '../../../../components/common/PhoneInput';
import Popup from '../../../../components/common/Popup';
import { EVENT_REFUND, CANCEL_EVENT, UPDATE_EVENT } from '../../gql';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import CheckboxTable from '../../../../components/CheckboxTable';
import { eventStates } from '../../../../constants/constants';

const required = (msg) => (val) => (!val ? msg : null);

const Requirements = React.forwardRef(({ theEvent, history, pathname }, ref) => {
    const { translate } = useTranslate();

    const [update, { loading }] = useMutation(UPDATE_EVENT);
    const [cancelationPopup, setCancelationPopup] = useState();

    if (!theEvent) {
        return null;
    }

    const {
        name,
        description,
        rider,
        genres,
        contactName,
        contactPhone,
        contactEmail,
        address,
    } = theEvent;

    const save = (key, optimistic) => (val) =>
        theEvent[key] !== val &&
        update({
            variables: {
                id: theEvent.id,
                hash: theEvent.hash,
                [key]: val,
            },
            optimisticResponse: {
                __typename: 'Mutation',
                updateEvent: {
                    __typename: 'Event',
                    ...theEvent,
                    ...optimistic,
                },
            },
        });

    const isCancable = ![eventStates.FINISHED, eventStates.CANCELLED].includes(theEvent.status);

    return (
        <Col ref={ref}>
            <SavingIndicator loading={loading} />

            <SettingsSection
                title={'Requirements'}
                description={
                    'Add requirements to help us find the most qualified DJs for your event. '
                }
            >
                <Input
                    label="Name"
                    defaultValue={name}
                    placeholder="Keep it short"
                    type="text"
                    onSave={save('name')}
                    validation={required('The event needs a name')}
                />
                <TextAreaPopup
                    label="Description"
                    initialValue={description}
                    placeholder="Description"
                    type="text"
                    save={save('description')}
                    validation={required('The event needs a description')}
                >
                    <Body>{translate('event-description-placeholder')}</Body>
                </TextAreaPopup>
                <GenreSelector half initialGenres={genres} save={save('genres')} />

                <Input
                    half
                    type="button"
                    label="Speakers"
                    onClick={() =>
                        save('speakers', {
                            rider: {
                                ...rider,
                                speakers: !rider.speakers,
                            },
                        })(!rider.speakers)
                    }
                    buttonText={rider.speakers ? 'Required' : 'Not required'}
                />
                <Input
                    half
                    type="button"
                    label="Lights"
                    onClick={() =>
                        save('lights', {
                            rider: {
                                ...rider,
                                lights: !rider.lights,
                            },
                        })(!rider.lights)
                    }
                    buttonText={rider.lights ? 'Required' : 'Not required'}
                />
                <Input
                    label="Event address"
                    defaultValue={address}
                    placeholder="10 Downing Street"
                    type="text"
                    onSave={save('address')}
                    attention={!address}
                />
            </SettingsSection>

            <SettingsSection
                title={'Contact information'}
                description={
                    'Enter information on the person communicating with the DJ. This information is only visible to the DJ after the DJ has been booked.'
                }
            >
                <Input
                    label="Contact name"
                    defaultValue={contactName}
                    placeholder="Keep it short"
                    type="text"
                    autoComplete="name"
                    name="name"
                    onSave={save('contactEmail')}
                    validation={required('Name is needed')}
                />
                <Input
                    label="Contact email"
                    defaultValue={contactEmail}
                    placeholder="mail@email.com"
                    type="email"
                    autoComplete="email"
                    name="email"
                    onSave={(email) => save('contactEmail')(email.trim())}
                    validation={(v) => (emailValidator.validate(v) ? null : 'Not a valid email')}
                />
                <PhoneInput
                    label="Phone"
                    attention={!contactPhone}
                    defaultValue={contactPhone}
                    placeholder="+123456789"
                    type="tel"
                    autoComplete="tel"
                    name="phone"
                    onSave={(phone) => save('contactPhone')(phone.trim())}
                />
            </SettingsSection>
            <SettingsSection
                id="system"
                title={'System'}
                description={
                    "Cancelling the event will give you a refund as per the DJ's cancelation policy."
                }
            >
                {isCancable && (
                    <Input
                        half
                        type="button"
                        label="Cancel event"
                        warning={true}
                        onClick={() => setCancelationPopup(true)}
                        buttonText="cancel"
                    />
                )}
                <Input
                    half
                    type="button"
                    label="Export all data"
                    buttonText="export"
                    onClick={(_) => {
                        window.alert("We'll send you an email when your data is ready.");
                    }}
                />
            </SettingsSection>

            {isCancable && (
                <Popup
                    width={530}
                    showing={cancelationPopup}
                    onClickOutside={() => setCancelationPopup(false)}
                >
                    <CancelationPopup
                        onCancelled={() => {
                            setCancelationPopup(false);
                            history.push(pathname + '/overview');
                        }}
                        theEvent={theEvent}
                        hide={() => setCancelationPopup(false)}
                    />
                </Popup>
            )}
        </Col>
    );
});

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
                        label: 'The event is not held anyway',
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

export default Requirements;
