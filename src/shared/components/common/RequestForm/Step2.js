import React, { PureComponent } from 'react';
import { SecondaryButton, TeritaryButton } from 'components/Blocks';
import { Input } from 'components/FormComponents';
import ToggleButtonHandler from '../ToggleButtonHandler';
import c from '../../../constants/constants';
import RiderOptions from '../RiderOptions2';
import GenreChooser from './GenreChooser';

export default class Step2 extends PureComponent {
    state = {
        showGenres: false,
    };
    validationChecker = null;

    next = () => {
        if (this.validationChecker(true)) {
            this.props.next();
        }
    };

    handleGenreSelection = (letCueupDecide) => {
        this.setState({
            showGenres: !letCueupDecide,
        });
    };

    render() {
        const { translate } = this.props;
        const { showGenres } = this.state;
        return (
            <form
                registerCheckForm={(checker) => {
                    this.validationChecker = checker;
                    this.props.formValidCheckers.push(checker);
                }}
                //  formValidCallback={(name)=>this.props.updateProgress(name,true)}
                // formInvalidCallback={(name)=>this.props.updateProgress(name,false)}
                name="requestForm-step-2"
            >
                <h3>{translate('request-form.step-2.header')}</h3>
                <section>
                    <label htmlFor="name">{translate('request-form.step-2.event-name')}</label>
                    <Input name="name" validate={['required']} />
                    <p>{translate('request-form.step-2.event-name-description')}</p>
                </section>
                <section>
                    <label>{translate('request-form.step-2.event-rider')}</label>
                    <p style={{ marginBottom: '10px' }}>
                        {translate('request-form.step-2.event-rider-description')}
                    </p>
                    <RiderOptions
                        speakersLabel={translate('speakers')}
                        lightsLabel={translate('lights')}
                        name="rider"
                    />
                </section>
                <section>
                    <label>{translate('request-form.step-2.event-genres')}</label>
                    <p style={{ marginBottom: '10px' }}>
                        {translate('request-form.step-2.event-genres-description')}
                    </p>
                    <GenreChooser
                        letCueupDecide={this.handleGenreSelection}
                        validate={['required']}
                        chooseLabel={translate('request-form.choose-genres')}
                        cueupDecideLabel={translate('request-form.let-cueup-decide')}
                        cueupDecideDescription={translate(
                            'request-form.let-cueup-decide-description'
                        )}
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
                <div style={{ position: 'relative' }}>
                    <TeritaryButton className="back-button" onClick={this.props.back}>
                        {translate('back')}
                    </TeritaryButton>
                    <SecondaryButton type="submit" onClick={this.next}>
                        {translate('continue')}
                    </SecondaryButton>
                </div>
            </form>
        );
    }
}
