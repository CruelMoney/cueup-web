import React from 'react';
import wNumb from 'wnumb';
import addTranslate from 'components/higher-order/addTranslate';
import { TeritaryButton, PrimaryButton, Row } from 'components/Blocks';
import { Input, Label } from 'components/FormComponents';
import { BodySmall } from 'components/Text';
import Slider from '../Slider';
import TimeSlider from '../TimeSlider';
import { RequestSection } from './RequestForm';

const Step3 = ({
    translate,
    form,
    next,
    back,
    handleChange,
    registerValidation,
    unregisterValidation,
}) => {
    return (
        <form>
            <h3>{translate('request-form.step-3.header')}</h3>
            <RequestSection>
                <Label style={{ marginBottom: '12px', display: 'block' }}>
                    {translate('request-form.step-3.music-duration')}
                </Label>
                <TimeSlider
                    hoursLabel={translate('hours')}
                    startLabel={translate('start')}
                    endLabel={translate('end')}
                    date={form.date}
                    initialValues={form.startMinute && [form.startMinute, form.endMinute]}
                    onChange={([startMinute, endMinute]) => {
                        handleChange({ startMinute });
                        handleChange({ endMinute });
                    }}
                />
            </RequestSection>

            <RequestSection>
                <Label style={{ marginBottom: '12px', display: 'block' }}>
                    {translate('request-form.step-3.guests')}
                </Label>
                <div>
                    <Slider
                        name="guests"
                        range={{
                            'min': 1,
                            '50%': 100,
                            '80%': 500,
                            'max': 1000,
                        }}
                        step={1}
                        connect="lower"
                        value={[form.guestsCount || 100]}
                        onChange={([guestsCount]) => handleChange({ guestsCount })}
                        format={wNumb({
                            decimals: 0,
                        })}
                    />
                </div>
                <BodySmall style={{ marginTop: '15px' }}>
                    {translate('request-form.step-3.guests-description', {
                        prefix: form.guests === 1000 ? translate('over') : translate('around'),
                        amount: form.guests,
                    })}
                </BodySmall>
            </RequestSection>
            <RequestSection>
                <Input
                    type="text-area"
                    style={{
                        height: '120px',
                    }}
                    defaultValue={form.description}
                    label={translate('request-form.step-3.event-description')}
                    placeholder={translate('request-form.step-3.event-description-description')}
                    name="description"
                    onSave={(description) => handleChange({ description })}
                    validation={(v) => (v ? null : 'Please write a description')}
                    registerValidation={registerValidation('description')}
                    unregisterValidation={unregisterValidation('description')}
                />
            </RequestSection>
            <Row right style={{ marginTop: '12px' }}>
                <TeritaryButton type="button" className="back-button" onClick={back}>
                    {translate('back')}
                </TeritaryButton>
                <PrimaryButton type="button" onClick={next}>
                    {translate('continue')}
                </PrimaryButton>
            </Row>
        </form>
    );
};

export default addTranslate(Step3);
