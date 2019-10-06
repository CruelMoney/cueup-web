import React, { useState } from 'react';
import { SecondaryButton, TeritaryButton, Row, PrimaryButton } from 'components/Blocks';
import { Input, Label } from 'components/FormComponents';
import addTranslate from 'components/higher-order/addTranslate';
import { BodySmall } from 'components/Text';
import ToggleButtonHandler from '../ToggleButtonHandler';
import c from '../../../constants/constants';
import RiderOptions from '../../RiderOptions';
import ToggleButton from '../ToggleButton';
import GenreChooser from './GenreChooser';

const Step2 = ({
    translate,
    form,
    next,
    back,
    handleChange,
    registerValidation,
    unregisterValidation,
    runValidations,
}) => {
    const [showGenres, setShowGenres] = useState(false);

    const handleGenreSelection = (letCueupDecide) => {
        setShowGenres(!letCueupDecide);
        if (letCueupDecide) {
            handleChange({ genres: ['top 40', 'local', "80's", 'disco', 'remixes'] });
        }
    };

    return (
        <form name="requestForm-step-2">
            <h3>{translate('request-form.step-2.header')}</h3>
            <section>
                <Input
                    label={translate('request-form.step-2.event-name')}
                    name="name"
                    validate={['required']}
                />
                <BodySmall>{translate('request-form.step-2.event-name-description')}</BodySmall>
            </section>
            <section>
                <Label>{translate('request-form.step-2.event-rider')}</Label>
                <BodySmall style={{ marginBottom: '10px' }}>
                    {translate('request-form.step-2.event-rider-description')}
                </BodySmall>
                <Row between>
                    <ToggleButton
                        onClick={(speakers) => handleChange({ speakers })}
                        label={translate('speakers')}
                        rounded
                    />

                    <ToggleButton
                        onClick={(speakers) => handleChange({ speakers })}
                        label={translate('lights')}
                        rounded
                    />
                </Row>
            </section>
            <section>
                <Label>{translate('request-form.step-2.event-genres')}</Label>
                <BodySmall style={{ marginBottom: '10px' }}>
                    {translate('request-form.step-2.event-genres-description')}
                </BodySmall>
                <GenreChooser
                    letCueupDecide={handleGenreSelection}
                    validate={['required']}
                    chooseLabel={translate('request-form.choose-genres')}
                    cueupDecideLabel={translate('request-form.let-cueup-decide')}
                    name="genres"
                />
                {showGenres ? (
                    <ToggleButtonHandler
                        validate={['required']}
                        name="genres"
                        potentialValues={c.GENRES}
                        columns={4}
                    />
                ) : null}
            </section>
            <Row right style={{ marginTop: '12px' }}>
                <TeritaryButton type="button" className="back-button" onClick={back}>
                    {translate('back')}
                </TeritaryButton>
                <PrimaryButton type="submit" onClick={next}>
                    {translate('continue')}
                </PrimaryButton>
            </Row>
        </form>
    );
};

export default addTranslate(Step2);
