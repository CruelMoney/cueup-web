import React from 'react';
import wNumb from 'wnumb';
import { TeritaryButton, PrimaryButton, Row } from 'components/Blocks';
import { Input, InputLabel, Label } from 'components/FormComponents';
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
    fromNewSearch,
}) => {
    return (
        <form>
            <h3 dangerouslySetInnerHTML={{ __html: translate('requestForm:step-3.header') }} />

            <RequestSection>
                <InputLabel v2 style={{ marginBottom: '12px', display: 'block' }}>
                    <span> {translate('requestForm:step-3.music-duration')}</span>
                </InputLabel>
                <TimeSlider
                    v2
                    hoursLabel={translate('hours')}
                    startLabel={translate('start')}
                    endLabel={translate('end')}
                    initialValues={form.startMinute && [form.startMinute, form.endMinute]}
                    onChange={([startMinute, endMinute]) => {
                        handleChange({ startMinute });
                        handleChange({ endMinute });
                    }}
                />
            </RequestSection>

            {!fromNewSearch && (
                <RequestSection>
                    <InputLabel v2 style={{ marginBottom: '12px', display: 'block' }}>
                        <span>{translate('requestForm:step-3.guests')}</span>
                    </InputLabel>
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
                    <BodySmall
                        style={{ marginTop: '15px', marginLeft: 9 }}
                        dangerouslySetInnerHTML={{
                            __html: translate('requestForm:step-3.guests-description', {
                                prefix:
                                    form.guestsCount === 1000
                                        ? translate('over')
                                        : translate('around'),
                                amount: form.guestsCount,
                            }),
                        }}
                    />
                </RequestSection>
            )}
            <RequestSection>
                <Input
                    v2
                    type="text-area"
                    style={{
                        height: '120px',
                    }}
                    defaultValue={form.description}
                    label={translate('requestForm:step-3.event-description')}
                    placeholder={translate('event-description-placeholder')}
                    name="description"
                    onSave={(description) => handleChange({ description })}
                    validation={(v) => (v ? null : 'Please write a description')}
                    registerValidation={registerValidation('description')}
                    unregisterValidation={unregisterValidation('description')}
                />
            </RequestSection>
            <Row right style={{ marginTop: '12px' }}>
                <TeritaryButton type="button" onClick={back}>
                    {translate('back')}
                </TeritaryButton>
                <PrimaryButton type="button" onClick={() => next()}>
                    {translate('continue') + ' 2/3'}
                </PrimaryButton>
            </Row>
        </form>
    );
};

export default Step3;
