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
    const { userSettings, payoutMethods } = me;

    return (
        <Col>
            <Popup
                width={'500px'}
                showing={payoutPopup}
                onClickOutside={() => setPayoutPopup(false)}
            >
                <PayoutForm
                    user={me}
                    onCancel={() => setPayoutPopup(false)}
                    onSubmitted={() => setPayoutPopup(false)}
                />
            </Popup>
            <Title>Make offer</Title>

            <OfferForm
                showPopup={() => setPayoutPopup(true)}
                profileCurrency={userSettings.currency}
                gig={gig}
                event={theEvent}
                payoutInfoValid={false && payoutMethods?.length}
                showDecline={showDecline}
                user={me}
            />
        </Col>
    );
};

const Offer = ({ loading, ...props }) =>
    loading ? <LoadingPlaceholder2 /> : <Content {...props} />;

export default Offer;
