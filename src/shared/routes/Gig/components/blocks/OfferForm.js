import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useMutation } from '@apollo/client';
import { InlineIcon } from '@iconify/react';
import infoIcon from '@iconify/icons-ion/information-circle';
import RadioSelect from 'components/RadioSelect';
import useTranslate from 'components/hooks/useTranslate';
import Tooltip from 'components/Tooltip';
import GreyBox from 'components/GreyBox';
import { useForm, validators } from 'components/hooks/useForm';
import { GET_OFFER, MAKE_OFFER, GIG } from '../../gql';
import ErrorMessageApollo from '../../../../components/common/ErrorMessageApollo';
import { gigStates, PAYOUT_TYPES } from '../../../../constants/constants';
import {
    SmartButton,
    PrimaryButton,
    RowWrap,
    Row,
    Hr,
    TeritaryButton,
    RowMobileCol,
} from '../../../../components/Blocks';
import { Input, InputRow, ProFeature } from '../../../../components/FormComponents';
import CurrencySelector from '../../../../components/CurrencySelector';
import { Body, BodyBold, TitleClean } from '../../../../components/Text';

const gigStateTitles = {
    [gigStates.CONFIRMED]: 'Your offer',
    [gigStates.FINISHED]: 'Your offer',
    default: 'Make your offer',
};

const OfferForm = ({
    gig,
    profileCurrency,
    payoutInfoValid,
    showPopup,
    showDecline,
    user,
    isPro,
}) => {
    const { translate } = useTranslate();
    const initOffer = gig?.offer || {
        offer: { amount: 0, formatted: 0 },
        serviceFee: { amount: 0, formatted: 0 },
        djFee: { amount: 0, formatted: 0 },
        totalPayment: { amount: 0, formatted: 0 },
        totalPayout: { amount: 0, formatted: 0 },
    };
    const initCurrency = gig?.offer?.offer?.currency || profileCurrency.toUpperCase();

    let initPayoutMethods = gig?.availablePayoutMethods?.map((pm) => pm.payoutType);
    if (!initPayoutMethods?.length) {
        // grab from dj
        initPayoutMethods = user.payoutMethods.map((pm) => pm.payoutType);
    }
    initPayoutMethods = initPayoutMethods.reduce((acc, pType) => ({ ...acc, [pType]: true }), {});

    const [offer, setNewOffer] = useState(initOffer);
    const [error, setError] = useState(null);
    const [currency, setCurrency] = useState(initCurrency);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [payoutMethods, setPayoutMethods] = useState(initPayoutMethods);
    const [pendingUpdate, setPendingUpdate] = useState(false);

    const { registerValidation, unregisterValidation, runValidations, setValue } = useForm(null, {
        amount: initOffer?.offer?.amount,
    });

    const [getOffer] = useMutation(GET_OFFER);
    const [makeOffer] = useMutation(MAKE_OFFER, {
        refetchQueries: [
            {
                query: GIG,
                variables: {
                    id: gig?.id,
                },
            },
        ],
    });

    const updateOffer = async () => {
        const payoutTypes = Object.entries(payoutMethods)
            .filter(([_k, v]) => v)
            .map(([k]) => k);

        if (!payoutTypes.length) {
            window.alert('Select at least 1 payout method');
            return;
        }

        const errors = runValidations();
        if (errors.length) {
            return;
        }

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
                        payoutTypes,
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

    const updatePaymentMethods = (key) => {
        if (!user.payoutMethods.some((pm) => pm.payoutType === key)) {
            showPopup();

            return;
        }

        setPendingUpdate(true);
        setPayoutMethods((s) => ({
            ...s,
            [key]: !s[key],
        }));
    };

    const { payoutType } = offer;

    const canUpdatePrice =
        gig.isActionable && [gigStates.REQUESTED, gigStates.ACCEPTED].includes(gig.status);

    const canSubmit =
        (pendingUpdate ||
            offer.offer.amount !== initOffer.offer.amount ||
            currency !== initOffer.offer.currency) &&
        !loading;

    return (
        <div data-cy="make-offer-section">
            {[gigStates.REQUESTED, gigStates.ACCEPTED].includes(gig.status) && (
                <GreyBox style={{ marginBottom: 15 }}>
                    <TitleClean style={{ marginBottom: '0.5em' }}>
                        {gigStateTitles[gig.status] ?? gigStateTitles.default}
                    </TitleClean>

                    <Body>{gigStateDescription[gig.status] ?? gigStateDescription.default}</Body>

                    {!!canUpdatePrice && (
                        <InputRow small style={{ marginTop: '20px' }}>
                            <Input
                                half
                                v2
                                label="Total Price"
                                name="amount"
                                placeholder="00,00"
                                //onUpdatePipeFunc={(oldVal,val)=>moneyPipe(oldVal,val,"DKK")}
                                type="text"
                                validation={[
                                    (v) => {
                                        console.log({ v });
                                        return !v || v <= 0 ? 'Enter your offer' : null;
                                    },
                                ]}
                                registerValidation={registerValidation('amount')}
                                unregisterValidation={unregisterValidation('amount')}
                                onChange={(amount) => {
                                    setValue({ amount });
                                    getFees({ amount: parseInt(amount, 10) * 100 });
                                }}
                                defaultValue={
                                    initOffer.offer.amount && initOffer.offer.amount / 100
                                }
                            />
                            <CurrencySelector
                                half
                                v2
                                label="Currency"
                                initialValue={currency || ''}
                                onSave={setCurrencyAndFetch}
                            />
                        </InputRow>
                    )}

                    {[gigStates.CONFIRMED, gigStates.FINISHED].includes(gig.status) && (
                        <RadioSelect
                            white
                            containerStyle={{ marginTop: '30px' }}
                            disabled
                            options={[
                                {
                                    checked: true,
                                    title:
                                        payoutType === PAYOUT_TYPES.BANK
                                            ? 'Using Cueup'
                                            : 'Directly to you',
                                    description:
                                        payoutType === PAYOUT_TYPES.BANK
                                            ? "Organizer has paid using Cueup and we'll transfer to you after the event."
                                            : 'Organizer will pay directly to you.',
                                },
                            ]}
                        />
                    )}
                    {!!canUpdatePrice && (
                        <div data-cy="payout-options">
                            <TitleClean style={{ marginBottom: '0.5em' }}>
                                Organizer Payment
                            </TitleClean>
                            <Body style={{ marginBottom: 12 }}>
                                Choose multiple to allow the organizer to pick one.
                            </Body>
                            <RadioSelect
                                white
                                containerStyle={{ marginBottom: '30px' }}
                                multi
                                setChosen={updatePaymentMethods}
                                options={[
                                    {
                                        checked: payoutMethods.BANK,
                                        title: 'Using Cueup - Secure & Guaranteed',
                                        description: 'Organizer can pay with card through Cueup.',
                                        value: PAYOUT_TYPES.BANK,
                                    },
                                    {
                                        checked: payoutMethods.DIRECT,
                                        title: 'Directly to you',
                                        description: 'Organizer can pay directly to you.',
                                        value: PAYOUT_TYPES.DIRECT,
                                    },
                                ]}
                            />
                        </div>
                    )}

                    <RowMobileCol reverse right style={{ marginTop: '24px' }}>
                        {[gigStates.REQUESTED, gigStates.ACCEPTED].includes(gig.status) && (
                            <TeritaryButton onClick={showDecline}>
                                {translate('Decline gig')}
                            </TeritaryButton>
                        )}

                        {gig.status === gigStates.CONFIRMED && (
                            <TeritaryButton onClick={showDecline} warning={true}>
                                {translate('Cancel gig')}
                            </TeritaryButton>
                        )}

                        {canUpdatePrice ? (
                            <SmartButton
                                loading={submitLoading}
                                success={submitted}
                                disabled={!canSubmit}
                                onClick={updateOffer}
                                data-cy="submit-offer-button"
                            >
                                {submitted
                                    ? 'Updated'
                                    : gig.status === gigStates.REQUESTED
                                    ? translate('Send offer')
                                    : translate('Update offer')}
                            </SmartButton>
                        ) : null}
                    </RowMobileCol>

                    <ErrorMessageApollo error={error} />
                </GreyBox>
            )}

            {![gigStates.CONFIRMED, gigStates.FINISHED].includes(gig.status) ? (
                <OfferTable
                    translate={translate}
                    loading={loading}
                    isPro={isPro}
                    discount={gig.discount}
                    status={gig.status}
                    {...offer}
                />
            ) : null}

            {[gigStates.CONFIRMED, gigStates.FINISHED].includes(gig.status) ? (
                <RemainingPayment translate={translate} loading={loading} {...offer} />
            ) : null}
        </div>
    );
};

const RemainingPayment = ({ translate, payoutType, amountLeft, amountPaid, offer }) => {
    const isDirect = payoutType === PAYOUT_TYPES.DIRECT;
    return (
        <GreyBox>
            <TitleClean>Your offer</TitleClean>
            <TableRow label="Your offer">{offer.formatted}</TableRow>
            <Hr />
            <TableRow
                label={translate('Already paid')}
                bold={!isDirect}
                info={
                    !isDirect
                        ? 'We will transfer the payment to your bank account after the event.'
                        : 'The organizer has paid the service fee, and the remaining will be paid directly to you.'
                }
            >
                {amountPaid.formatted}
            </TableRow>
            <Hr />
            {!!isDirect && (
                <TableRow
                    label={translate('Pay directly to you')}
                    bold
                    info={
                        'The organizer will pay this to you according to your direct payout method.'
                    }
                >
                    {amountLeft.formatted}
                </TableRow>
            )}
        </GreyBox>
    );
};

const OfferTable = ({
    status,
    loading,
    translate,
    serviceFee,
    djFee,
    totalPayout,
    isPro,
    discount,
}) => {
    const titles = {
        [gigStates.CANCELLED]: 'Your offer',
        [gigStates.DECLINED]: 'Your offer',
        [gigStates.LOST]: 'Your offer',
        [gigStates.ORGANIZER_DECLINED]: 'Your offer',
        [gigStates.EVENT_CANCELLED]: 'Your offer',
    };

    const label = titles[status] || 'Your Payout';

    return (
        <GreyBox>
            <TitleClean style={{ marginBottom: '0.5em' }}>{label}</TitleClean>

            {!discount && (
                <TableRow
                    label={translate('Service fee')}
                    info={
                        'This fee is used to run the platform. Cueup Pro members do not pay this fee.'
                    }
                >
                    {loading ? 'loading...' : serviceFee.formatted ? serviceFee.formatted : '...'}
                    <ProFeature style={{ fontSize: '18px' }} disabled={isPro}>
                        Free for Pro members
                    </ProFeature>
                </TableRow>
            )}
            <Hr />
            <TableRow
                label={translate('Payment processing')}
                info={'A fee on 3% for the payment provider if the customer pays with card.'}
            >
                {loading ? 'loading...' : djFee.formatted ? djFee.formatted : '...'}
            </TableRow>
            <Hr />
            <TableRow label="Your total payout" bold>
                {loading ? 'loading...' : totalPayout.formatted ? totalPayout.formatted : '...'}
            </TableRow>
        </GreyBox>
    );
};

const gigStateDescription = {
    [gigStates.CONFIRMED]: 'The organizer has accepted your offer.',
    default:
        'Enter your price to play this gig. You can always update the offer until the organizer has confirmed.',
};

const style2 = { lineHeight: '48px', margin: 0 };

const TableRow = ({ label, info, value, children, bold }) =>
    bold ? (
        <Row between middle>
            <BodyBold style={style2}>{value || children}</BodyBold>{' '}
            <BodyBold style={style2}>
                {label} {info && <InfoPopup content={info} />}
            </BodyBold>
        </Row>
    ) : (
        <Row between middle>
            <Body style={style2}>{value || children}</Body>{' '}
            <Body style={style2}>
                {label} {info && <InfoPopup content={info} />}
            </Body>
        </Row>
    );

const InfoPopup = ({ content }) => {
    return (
        <Tooltip content={content}>
            {({ ref, close, open }) => (
                <span ref={ref} onMouseEnter={open} onMouseLeave={close}>
                    <InlineIcon icon={infoIcon} />
                </span>
            )}
        </Tooltip>
    );
};

export default OfferForm;
