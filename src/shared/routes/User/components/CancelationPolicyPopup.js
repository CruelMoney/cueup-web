import React, { useState } from 'react';
import ArrowIcon from 'react-ionicons/lib/MdArrowRoundForward';
import ToggleOptions from 'components/common/ToggleOptions';
import { Input, Label } from '../../../components/FormComponents';
import { Row, TeritaryButton, PrimaryButton } from '../../../components/Blocks';
import Popup from '../../../components/common/Popup';
import Slider from '../../../components/common/Slider';
import { Stat, StatUnit, BodySmall } from '../../../components/Text';

const CancelationPolicyPopup = ({ initialValue, save, translate }) => {
    const [cancelationPolicy, setCancelationPolicy] = useState(initialValue);
    const [showing, setShowing] = useState(false);

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

            <Popup showing={showing} onClickOutside={(_) => setShowing(false)} width={'520px'}>
                <Label>{translate('Cancelation policy')}</Label>
                <PolicyDisplayer
                    style={{ maxWidth: '350px' }}
                    cancelationPolicy={cancelationPolicy}
                    explanationText={`Organizer can cancel any time before ${cancelationPolicy.days} days, and get a 100%
							refund, minus the service fee.`}
                />

                <div
                    style={{
                        marginTop: '24px',
                        marginBottom: '24px',
                    }}
                >
                    <ToggleOptions
                        name="cancelationDays"
                        glued={true}
                        value={cancelationPolicy.days}
                        onChange={(days) =>
                            setCancelationPolicy((s) => ({
                                ...s,
                                days,
                            }))
                        }
                    >
                        <button name={1} color="#50E3C2">
                            1 {translate('day')}
                        </button>
                        <button name={2} color="#50E3C2">
                            2 {translate('days')}
                        </button>
                        <button name={7} color="#50E3C2">
                            1 {translate('week')}
                        </button>
                        <button name={14} color="#50E3C2">
                            2 {translate('weeks')}
                        </button>
                        <button name={30} color="#50E3C2">
                            1 {translate('month')}
                        </button>
                    </ToggleOptions>
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

                <Row style={{ marginTop: '15px' }} right>
                    <TeritaryButton type="button" onClick={(_) => setShowing(false)}>
                        Cancel
                    </TeritaryButton>
                    <PrimaryButton
                        type="button"
                        onClick={() => {
                            setShowing(false);
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
            <ArrowIcon color={'#98a4b3'} fontSize={'18px'} />
            <StatUnit>OR ELSE</StatUnit>
            <ArrowIcon color={'#98a4b3'} fontSize={'18px'} />

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
