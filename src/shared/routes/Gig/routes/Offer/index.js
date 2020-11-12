import React, { useState } from 'react';
import { gigStates } from 'constants/constants';
import DeclinedInformation from 'routes/Gig/components/blocks/DeclinedInformation';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import { Col } from '../../../../components/Blocks';
import OfferForm from '../../components/blocks/OfferForm';
import Popup from '../../../../components/common/Popup';
import PayoutForm from '../../../../components/common/PayoutForm';

const DefaultRightSide = ({ gig, opportunity, theEvent, me, showDecline }) => {
    const [payoutPopup, setPayoutPopup] = useState(false);

    const { userSettings, payoutMethods, appMetadata } = me;

    const isPro = appMetadata?.isPro;

    return (
        <>
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
            <OfferForm
                showPopup={() => setPayoutPopup(true)}
                profileCurrency={userSettings.currency}
                gig={gig}
                event={theEvent}
                payoutInfoValid={payoutMethods?.length}
                showDecline={showDecline}
                user={me}
                isPro={isPro}
            />
        </>
    );
};

const rightSideComponents = {
    [gigStates.DECLINED]: DeclinedInformation,
};

const Content = (props) => {
    const { me, gig } = props;
    if (!me) {
        return null;
    }

    const Component = rightSideComponents[gig.status] || DefaultRightSide;

    return (
        <Col>
            <Component {...props} />
        </Col>
    );
};

const Offer = ({ loading, ...props }) =>
    loading ? <LoadingPlaceholder2 /> : <Content {...props} />;

export default Offer;
