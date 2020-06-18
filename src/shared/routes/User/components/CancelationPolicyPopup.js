import React, { useState } from 'react';
import { Icon, InlineIcon } from '@iconify/react';
import arrowForward from '@iconify/icons-ion/arrow-forward';
import SuggestionList from 'components/SuggestionList';
import { Input } from '../../../components/FormComponents';
import { Row, TeritaryButton, PrimaryButton } from '../../../components/Blocks';
import Popup from '../../../components/common/Popup';
import Slider from '../../../components/common/Slider';
import { Stat, StatUnit, BodySmall } from '../../../components/Text';

const CancelationPolicyPopup = ({ initialValue, onClose, save, translate, isActive }) => {
    const [cancelationPolicy, setCancelationPolicy] = useState(initialValue);
    const [showing, setShowing] = useState(isActive);

    const closeModal = () => {
        setShowing(false);
        onClose && onClose();
    };

    return (
        <>
            <Input
                half
                type="button"
                Input
                label="Cancelation policy"
                buttonText={`${initialValue.days} days, ${initialValue.percentage}%`}
                onClick={(_) => setShowing(true)}
            />

            <Popup showing={showing} onClickOutside={closeModal} width={'520px'}>
                <div
                    style={{
                        marginBottom: '24px',
                    }}
                >
                    <SuggestionList
                        label={translate('Cancelation policy')}
                        value={cancelationPolicy.days}
                        noShadow
                        disableInput
                        onChange={(days) =>
                            setCancelationPolicy((s) => ({
                                ...s,
                                days,
                            }))
                        }
                        suggestions={[
                            {
                                label: '1 ' + translate('day'),
                                value: 1,
                            },
                            {
                                label: '2 ' + translate('days'),
                                value: 2,
                            },
                            {
                                label: '1 ' + translate('week'),
                                value: 7,
                            },
                            {
                                label: '2 ' + translate('weeks'),
                                value: 14,
                            },
                            {
                                label: '1 ' + translate('month'),
                                value: 28,
                            },
                        ]}
                    />
                </div>
                <Slider
                    name="refundPercentage"
                    range={{ min: 0, max: 100 }}
                    step={1}
                    connect="lower"
                    value={[cancelationPolicy.percentage]}
                    color="#50E3C2"
                    onChange={(values) =>
                        setCancelationPolicy((s) => ({
                            ...s,
                            percentage: values[0],
                        }))
                    }
                />

                <PolicyDisplayer
                    style={{ maxWidth: '350px' }}
                    cancelationPolicy={cancelationPolicy}
                    explanationText={`Organizer can cancel any time before ${cancelationPolicy.days} days, and get a 100%
							refund, minus the service fee.`}
                />

                <Row style={{ marginTop: '15px' }} right>
                    <TeritaryButton type="button" onClick={closeModal}>
                        Cancel
                    </TeritaryButton>
                    <PrimaryButton
                        type="button"
                        onClick={() => {
                            closeModal();
                            save(cancelationPolicy);
                        }}
                    >
                        Save
                    </PrimaryButton>
                </Row>
            </Popup>
        </>
    );
};

export const PolicyDisplayer = ({ cancelationPolicy, style, explanationText }) => (
    <>
        <Row
            style={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '42px',
                marginBottom: '30px',
                ...style,
            }}
        >
            <Stat label={'MIN. NOTICE'} value={cancelationPolicy.days + ' days'} />
            <Icon icon={arrowForward} color={'#98a4b3'} style={{ fontSize: '18px' }} />
            <StatUnit>OR ELSE</StatUnit>
            <Icon icon={arrowForward} color={'#98a4b3'} style={{ fontSize: '18px' }} />

            <Stat label={'REFUNDED'} value={cancelationPolicy.percentage + '%'} />
        </Row>
        <BodySmall style={{ marginBottom: 0 }}>
            {explanationText ||
                `Cancel any time before ${cancelationPolicy.days} days, and get a 100%
			refund, minus the service fee.`}
        </BodySmall>
    </>
);

export default CancelationPolicyPopup;
