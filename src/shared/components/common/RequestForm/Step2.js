import React, { useRef } from 'react';
import { TeritaryButton, Row, PrimaryButton } from 'components/Blocks';
import { useValidation } from 'components/hooks/useForm';
import { Input, Label, LabelHalf, InputRow, InputLabel } from 'components/FormComponents';
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
    fromNewSearch,
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
            <h3 dangerouslySetInnerHTML={{ __html: translate('requestForm:step-2.header') }} />
            <RequestSection>
                <Input
                    v2
                    name="eventName"
                    label={translate('requestForm:step-2.event-name')}
                    onSave={(name) => handleChange({ name })}
                    validation={(v) => (v ? null : 'Please write a name')}
                    registerValidation={registerValidation('name')}
                    unregisterValidation={unregisterValidation('name')}
                    defaultValue={form.name}
                >
                    <BodySmall>{translate('requestForm:step-2.event-name-description')}</BodySmall>
                </Input>
            </RequestSection>
            {!fromNewSearch && (
                <RequestSection>
                    <InputRow small>
                        <LabelHalf v2>
                            {translate('speakers')}
                            <ToggleButton
                                onClick={(speakers) => handleChange({ speakers })}
                                active={form.speakers}
                                label={translate('Not required')}
                                labelToggled={translate('Required')}
                            />
                        </LabelHalf>
                        <LabelHalf v2>
                            {translate('lights')}
                            <ToggleButton
                                onClick={(lights) => handleChange({ lights })}
                                label={translate('Not required')}
                                labelToggled={translate('Required')}
                                active={form.lights}
                            />
                        </LabelHalf>
                    </InputRow>
                </RequestSection>
            )}
            <RequestSection>
                <InputLabel v2>
                    <span>{translate('requestForm:step-2.event-genres')}</span>
                    <BodySmall style={{ marginBottom: '10px' }}>
                        {translate('requestForm:step-2.event-genres-description')}
                    </BodySmall>
                </InputLabel>

                <GenreChooser
                    letCueupDecide={form.letCueupDecide}
                    setLetcueupDecide={handleGenreSelection}
                    chooseLabel={translate('requestForm:choose-genres')}
                    cueupDecideLabel={translate('requestForm:let-cueup-decide')}
                    name="genres"
                />
                {form.letCueupDecide === false ? (
                    <ToggleButtonHandler
                        name="genres"
                        onChange={(genres) => {
                            handleChange({ genres });
                            runValidation(genres);
                        }}
                        colored
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
                <TeritaryButton type="button" onClick={back}>
                    {translate('back')}
                </TeritaryButton>
                <PrimaryButton type="button" onClick={() => next()}>
                    {translate('continue') + ' 1/3'}
                </PrimaryButton>
            </Row>
        </form>
    );
};

export default Step2;
