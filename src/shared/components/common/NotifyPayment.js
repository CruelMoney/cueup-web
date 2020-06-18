import React from 'react';
import TextWrapper from './TextElement';

const NotifyPayment = ({ translate }) => {
    return (
        <div className="notify-pay-form">
            <TextWrapper
                label={translate('Pay')}
                showLock={true}
                text={translate('event:offer.pay-later')}
            />
        </div>
    );
};

export default NotifyPayment;
