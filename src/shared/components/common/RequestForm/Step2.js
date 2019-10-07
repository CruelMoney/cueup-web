import React, { useState, useRef } from 'react';
import { TeritaryButton, Row, PrimaryButton, RowWrap } from 'components/Blocks';
import { Input, Label, useValidation, LabelHalf, InputRow } from 'components/FormComponents';
import addTranslate from 'components/higher-order/addTranslate';
import { BodySmall } from 'components/Text';
import ToggleButtonHandler from '../ToggleButtonHandler';
import c from '../../../constants/constants';
import ToggleButton from '../ToggleButton';
import ErrorMessageApollo from '../ErrorMessageApollo';
import GenreChooser from './GenreChooser';
import { RequestSection } from './RequestForm';

const Step2 = ({
    translate,
    form,
    next,
    back,
    handleChange,
    registerValidation,
    unregisterValidation,
}) => {
    const genreErrorRef = useRef();

    const { error, runValidation } = useValidation({
        registerValidation: registerValidation('genres'),
        unregisterValidation: unregisterValidation('genres'),
        validation: (genres) => {
            return !genres || genres.length === 0 ? 'Please select genres' : null;
        },
        ref: genreErrorRef,
    });

    const handleGenreSelection = (letCueupDecide) => {
        if (letCueupDecide) {
            const defaultGenres = ['top 40', 'local', "80's", 'disco', 'remixes'];
            runValidation(defaultGenres);
            handleChange({ genres: defaultGenres, letCueupDecide: true });
        } else {
            handleChange({ genres: [], letCueupDecide: false });
        }
    };

    return (
        <form name="requestForm-step-2">
            <h3>{translate('request-form.step-2.header')}</h3>
            <RequestSection>
                <Label>{translate('request-form.step-2.event-name')}</Label>
                <BodySmall>{translate('request-form.step-2.event-name-description')}</BodySmall>
                <Input
                    onSave={(name) => handleChange({ name })}
                    validation={(v) => (v ? null : 'Please write a name')}
                    registerValidation={registerValidation('name')}
                    unregisterValidation={unregisterValidation('name')}
                    defaultValue={form.name}
                />
            </RequestSection>
            <RequestSection>
                <InputRow>
                    <LabelHalf>
                        {translate('speakers')}
                        <ToggleButton
                            onClick={(speakers) => handleChange({ speakers })}
                            rounded
                            active={form.speakers}
                            label={translate('Not required')}
                            labelToggled={translate('Required')}
                        />
                    </LabelHalf>
                    <LabelHalf>
                        {translate('lights')}
                        <ToggleButton
                            rounded
                            onClick={(lights) => handleChange({ lights })}
                            label={translate('Not required')}
                            labelToggled={translate('Required')}
                            active={form.lights}
                        />
                    </LabelHalf>
                </InputRow>
            </RequestSection>
            <RequestSection>
                <Label>{translate('request-form.step-2.event-genres')} </Label>
                <BodySmall style={{ marginBottom: '10px' }}>
                    {translate('request-form.step-2.event-genres-description')}
                </BodySmall>
                <GenreChooser
                    letCueupDecide={form.letCueupDecide}
                    setLetcueupDecide={handleGenreSelection}
                    chooseLabel={translate('request-form.choose-genres')}
                    cueupDecideLabel={translate('request-form.let-cueup-decide')}
                    name="genres"
                />
                {form.letCueupDecide === false ? (
                    <ToggleButtonHandler
                        name="genres"
                        onChange={(genres) => {
                            handleChange({ genres });
                            runValidation(genres);
                        }}
                        value={form.genres}
                        potentialValues={c.GENRES}
                        columns={4}
                    />
                ) : null}
                <Label ref={genreErrorRef}>
                    <ErrorMessageApollo error={error} />
                </Label>
            </RequestSection>
            <Row right style={{ marginTop: '12px' }}>
                <TeritaryButton type="button" className="back-button" onClick={back}>
                    {translate('back')}
                </TeritaryButton>
                <PrimaryButton type="button" onClick={() => next()}>
                    {translate('continue')}
                </PrimaryButton>
            </Row>
        </form>
    );
};

export default addTranslate(Step2);
