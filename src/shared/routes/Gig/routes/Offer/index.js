import React, { useState } from 'react';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import { Col } from '../../../../components/Blocks';
import { Body, Title } from '../../../../components/Text';
import OfferForm from '../../components/blocks/OfferForm';
import Popup from '../../../../components/common/Popup';
import PayoutForm from '../../../../components/common/PayoutForm';

const Content = ({ gig, theEvent, me, showDecline }) => {
    const [payoutPopup, setPayoutPopup] = useState(false);
    if (!me || !gig) {
        return null;
    }
    const { userSettings, userMetadata } = me;
    const info =
        'Enter your price to play this gig. You can always update the offer until the organizer has confirmed.';

    return (
        <Col>
            <Popup showing={payoutPopup} onClickOutside={() => setPayoutPopup(false)}>
                <PayoutForm
                    user={me}
                    onCancel={() => setPayoutPopup(false)}
                    onSubmitted={() => setPayoutPopup(false)}
                />
            </Popup>
            <Title>Make offer</Title>
            <Body>{info}</Body>
            <OfferForm
                showPopup={() => setPayoutPopup(true)}
                profileCurrency={userSettings.currency}
                gig={gig}
                event={theEvent}
                payoutInfoValid={!!userMetadata.bankAccount}
                showDecline={showDecline}
            />
        </Col>
    );
};

const Offer = ({ loading, ...props }) =>
    loading ? <LoadingPlaceholder2 /> : <Content {...props} />;

export default Offer;
