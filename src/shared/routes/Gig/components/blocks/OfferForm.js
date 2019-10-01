import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { useMutation } from '@apollo/react-hooks';
import { GET_OFFER, MAKE_OFFER, GIG } from '../../gql';
import ErrorMessageApollo from '../../../../components/common/ErrorMessageApollo';
import { gigStates } from '../../../../constants/constants';
import {
    SecondaryButton,
    SmartButton,
    PrimaryButton,
    RowWrap,
    Row,
    Col,
    Hr,
} from '../../../../components/Blocks';
import { Input, InputRow } from '../../../../components/FormComponents';
import CurrencySelector from '../../../../components/CurrencySelector';
import { Body, BodyBold } from '../../../../components/Text';
import addTranslate from '../../../../components/higher-order/addTranslate';
import content from '../../../User/content.json';

const OfferForm = ({
    gig,
    profileCurrency,
    translate,
    payoutInfoValid,
    event,
    updateGig,
    showPopup,
    showDecline,
}) => {
    const initOffer = gig.offer || {
        offer: { amount: 0, formatted: 0 },
        serviceFee: { amount: 0, formatted: 0 },
        djFee: { amount: 0, formatted: 0 },
        totalPayment: { amount: 0, formatted: 0 },
        totalPayout: { amount: 0, formatted: 0 },
    };
    const initCurrency = gig.offer ? gig.offer.offer.currency : profileCurrency.toUpperCase();

    const [offer, setNewOffer] = useState(initOffer);
    const [error, setError] = useState(null);
    const [currency, setCurrency] = useState(initCurrency);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [getOffer] = useMutation(GET_OFFER);
    const [makeOffer] = useMutation(MAKE_OFFER, {
        refetchQueries: [
            {
                query: GIG,
                variables: { id: gig.id },
            },
        ],
    });

    const updateOffer = async () => {
        if (payoutInfoValid) {
            setError(null);
            setSubmitLoading(true);
            try {
                const {
                    data: { makeOffer: newOffer },
                } = await makeOffer({
                    variables: {
                        currency,
                        amount: offer.offer.amount,
                        gigId: gig.id,
                    },
                });
                setNewOffer(newOffer);
                setSubmitted(true);
            } catch (error) {
                setError(error);
            }
            setSubmitLoading(false);
        }
    };

    const getFeesDebounced = debounce(async ({ amount, newCurrency = currency }) => {
        if (amount && amount > 0) {
            setLoading(true);
            setError(null);
            try {
                const {
                    data: { getOffer: newOffer },
                } = await getOffer({
                    variables: {
                        gigId: gig.id,
                        amount,
                        currency: newCurrency,
                    },
                });
                setNewOffer(newOffer);
            } catch (error) {
                console.log({ error });
                setError(error);
            }

            setLoading(false);
        }
    }, 1000);

    const getFees = (data) => {
        setLoading(true);
        getFeesDebounced(data);
    };

    const setCurrencyAndFetch = (c) => {
        setCurrency(c);
        getFees({ newCurrency: c, amount: offer.offer.amount });
    };

    const canSubmit =
        (offer.offer.amount !== initOffer.offer.amount || currency !== initOffer.offer.currency) &&
        parseInt(offer.offer.amount, 10) > 0 &&
        !loading;

    const { serviceFee, totalPayment, totalPayout, djFee } = offer;

    const canUpdatePrice =
        payoutInfoValid &&
        gig.isActionable &&
        [gigStates.REQUESTED, gigStates.ACCEPTED].includes(gig.status);

    return (
        <div>
            {canUpdatePrice && (
                <InputRow style={{ marginTop: '20px' }}>
                    <Input
                        half
                        label="Price"
                        name="amount"
                        placeholder="00,00"
                        //onUpdatePipeFunc={(oldVal,val)=>moneyPipe(oldVal,val,"DKK")}

                        type="text"
                        onChange={(val) => getFees({ amount: parseInt(val, 10) * 100 })}
                        defaultValue={initOffer.offer.amount && initOffer.offer.amount / 100}
                    />
                    <CurrencySelector
                        half
                        label="Currency"
                        initialValue={currency || ''}
                        onSave={setCurrencyAndFetch}
                    />
                </InputRow>
            )}

            {payoutInfoValid ? (
                <Col style={{ maxWidth: '400px', marginBottom: '30px', marginTop: '30px' }}>
                    <div style={style1}>
                        <TableRow
                            label={translate('Service fee')}
                            info={<div>{translate('gig.offer.service-fee-info')}</div>}
                        >
                            {loading
                                ? 'loading...'
                                : serviceFee.formatted
                                ? serviceFee.formatted
                                : '...'}
                        </TableRow>
                        <Hr />
                        <TableRow label="Organizers total price" bold>
                            {loading
                                ? 'loading...'
                                : totalPayment.formatted
                                ? totalPayment.formatted
                                : '...'}
                        </TableRow>
                    </div>
                    <div style={style1}>
                        <TableRow
                            label={translate('Cueup fee')}
                            info={<div>{translate('gig.offer.dj-fee-info')}</div>}
                        >
                            {loading ? 'loading...' : djFee.formatted ? djFee.formatted : '...'}
                        </TableRow>
                        <Hr />
                        <TableRow label="Your total payout" bold>
                            {loading
                                ? 'loading...'
                                : totalPayout.formatted
                                ? totalPayout.formatted
                                : '...'}
                        </TableRow>
                    </div>
                </Col>
            ) : null}

            {!payoutInfoValid ? <Body>{translate('gig.offer.update-payout')}</Body> : null}

            <RowWrap>
                <div name={'gig-cancel-' + gig.id}>
                    {[gigStates.REQUESTED, gigStates.ACCEPTED].includes(gig.status) && (
                        <SecondaryButton onClick={showDecline}>
                            {translate('Decline gig')}
                        </SecondaryButton>
                    )}

                    {gig.status === gigStates.CONFIRMED && (
                        <SecondaryButton onClick={showDecline} warning={true}>
                            {translate('Cancel gig')}
                        </SecondaryButton>
                    )}
                </div>

                {canUpdatePrice && (
                    <SmartButton
                        disabled={!canSubmit}
                        loading={submitLoading}
                        succes={submitted}
                        onClick={updateOffer}
                    >
                        {submitted
                            ? 'Updated'
                            : gig.status === gigStates.REQUESTED
                            ? translate('Send offer')
                            : translate('Update offer')}
                    </SmartButton>
                )}

                {!payoutInfoValid && (
                    <PrimaryButton rounded={true} onClick={showPopup} name="show-payout-popup">
                        {translate('Update payout info')}
                    </PrimaryButton>
                )}
            </RowWrap>

            <ErrorMessageApollo error={error} />
        </div>
    );
};

const style1 = { marginBottom: '24px' };
const style2 = { lineHeight: '48px', margin: 0 };

const TableRow = ({ label, value, children, bold }) =>
    bold ? (
        <Row between middle>
            <BodyBold style={style2}>{value || children}</BodyBold>{' '}
            <BodyBold style={style2}>{label}</BodyBold>
        </Row>
    ) : (
        <Row between middle>
            <Body style={style2}>{value || children}</Body> <Body style={style2}>{label}</Body>
        </Row>
    );

export default addTranslate(OfferForm, [content]);
