import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { Title, Body } from 'components/Text';
import RadioSelect from 'components/RadioSelect';
import { PAYOUT_TYPES } from '../../../constants/constants';

import StripeWrapper from './BankAccount';
import DirectPayout from './Direct';

function mapStateToProps(state, ownprops) {
    return {
        ...ownprops,
        translate: getTranslate(state.locale),
        currentLanguage: getActiveLanguage(state.locale).code,
    };
}

const PayoutComponent = connect(mapStateToProps)((props) => {
    const { translate, user } = props;
    const { payoutMethods } = user;
    const bankAccount = payoutMethods.find((p) => p.payoutType === PAYOUT_TYPES.BANK);
    const direct = payoutMethods.find((p) => p.payoutType === PAYOUT_TYPES.DIRECT);

    const [currentView, setCurrentView] = useState();

    if (currentView === PAYOUT_TYPES.BANK) {
        return (
            <StripeWrapper
                {...props}
                {...bankAccount}
                onSubmitted={() => setCurrentView(null)}
                onCancel={() => setCurrentView(null)}
            />
        );
    }
    if (currentView === PAYOUT_TYPES.DIRECT) {
        return (
            <DirectPayout
                {...props}
                {...direct}
                onSubmitted={() => setCurrentView(null)}
                onCancel={() => setCurrentView(null)}
            />
        );
    }

    return (
        <div>
            <Title>{translate('Payout methods')}</Title>
            <Body style={{ marginBottom: 24 }}>{translate('payout.description-1')}</Body>
            <RadioSelect
                multi
                setChosen={setCurrentView}
                options={[
                    {
                        value: PAYOUT_TYPES.BANK,
                        checked: !!bankAccount,
                        title: 'Bank Account',
                        description:
                            'We take care of charging the organizer and the money is transferred to you immediately after the event.',
                    },
                    {
                        value: PAYOUT_TYPES.DIRECT,
                        checked: !!direct,
                        title: 'Direct',
                        description:
                            'You are responsible for charging the organizer yourself. Using this method we cannot guarantee your payout or use your cancelation policy.',
                    },
                ]}
            />
        </div>
    );
});

export default PayoutComponent;

export const DisconnectedPayoutForm = StripeWrapper;
