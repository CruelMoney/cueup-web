import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import Popup from 'components/common/Popup';
import { Col, PrimaryButton, TeritaryButton } from 'components/Blocks';
import { Body } from 'components/Text';
import { eventRoutes, appRoutes } from 'constants/locales/appRoutes';

export const ChatConfirmBeforeContact = ({ event, gigId }) => {
    const history = useHistory();

    const onInitiateBooking = () => {
        console.log({ event });
        history.push(
            `/event/${event.id}/${event.hash}/` + eventRoutes.checkout.replace(':gigId', gigId)
        );
    };

    return (
        <Popup
            lazy={false}
            width={1000}
            showing
            onClose={() => {
                history.goBack();
            }}
        >
            <ContentContainer data-cy="subscription-popup">
                <Col style={{ maxWidth: 450, textAlign: 'center', alignItems: 'center' }}>
                    <h1>Whoops! Looks like you tried to share contact information.</h1>

                    <Body style={{ marginBottom: 30 }}>
                        You can only share contact information once you've confirmed the booking.
                    </Body>
                    <PrimaryButton onClick={onInitiateBooking}>Book now</PrimaryButton>
                    <TeritaryButton
                        onClick={() => {
                            history.goBack();
                        }}
                        style={{ marginTop: 12, maxWidth: '100%' }}
                    >
                        Book later
                    </TeritaryButton>
                </Col>
            </ContentContainer>
        </Popup>
    );
};

const ContentContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export default ChatConfirmBeforeContact;
