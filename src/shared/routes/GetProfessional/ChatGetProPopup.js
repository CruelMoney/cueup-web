import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Col, PrimaryButton, TeritaryButton } from 'components/Blocks';
import { Body } from 'components/Text';
import { CustomCheckBox } from './BenefitsPopup';
import GenericPopup from './GenericPopup';

export const ChatGoProPopup = () => {
    const [showGoPro, setShowGoPro] = useState(false);
    const history = useHistory();

    return (
        <GenericPopup showPayment={showGoPro}>
            {showGoPro ? (
                <Col>
                    <h2 style={{ marginBottom: 24 }}>Play more gigs with Cueup Pro</h2>
                    <CustomCheckBox
                        checked
                        label="Get contact details before booking has been confirmed."
                    />
                    <CustomCheckBox checked label="Top position in search results." />
                    <CustomCheckBox checked label="No commission fee on gigs." />
                    <CustomCheckBox checked label="Unlimited playing locations & travel." />
                    <CustomCheckBox checked label="Add website & social media links to profile." />
                    <CustomCheckBox
                        checked
                        label="Automatic refund each month if you don't receive any gig requests."
                    />
                    <CustomCheckBox checked label="Unlimited sound uploads." />
                    <CustomCheckBox checked label={'Pro DJ badge.'} />
                    <CustomCheckBox checked label="And much more..." />
                </Col>
            ) : (
                <Col style={{ maxWidth: 450, textAlign: 'center', alignItems: 'center' }}>
                    <h2>Whoops! Looks like you tried to share contact information</h2>

                    <Body style={{ marginBottom: 30 }}>
                        You can only share contact information once the gig is confirmed by the
                        organizer or if you are a Pro member.
                    </Body>
                    <PrimaryButton onClick={() => setShowGoPro(true)}>Go Pro</PrimaryButton>
                    <TeritaryButton
                        onClick={() => {
                            history.goBack();
                        }}
                        style={{ marginTop: 12, maxWidth: '100%' }}
                    >
                        Wait until organizer confirms
                    </TeritaryButton>
                </Col>
            )}
        </GenericPopup>
    );
};

export default ChatGoProPopup;
