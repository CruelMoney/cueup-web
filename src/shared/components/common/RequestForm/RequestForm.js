import React, { PureComponent } from 'react';
import moment from 'moment-timezone';
import { Mutation } from 'react-apollo';
import { PrimaryButton } from 'components/Blocks';
import Popup from '../Popup';
import Login from '../Login';
import addTranslate from '../../../components/higher-order/addTranslate';
import ErrorMessageApollo from '../ErrorMessageApollo';
import Progress from './ProgressSubmit';
import content from './content.json';
import Step1 from './Step1';
import Step2 from './Step2';

import { CREATE_EVENT } from './gql';

const MainForm = class extends PureComponent {
    static defaultProps = {
        form: { values: {} },
    };

    state = {
        showPopup: false,
        emailExists: false,
        activeStep: 1,
        date: moment(),
        error: false,
    };

    formToEvent(form) {
        return {
            ...form,
            guestsCount: form.guests[0],
            timeZone: this.state.timeZoneId,
            location: this.state.location,
            date: this.state.date.toDate(),
        };
    }

    formValidCheckers = [];

    submitEvent = (event, mutate, callback) => {
        const { translate } = this.props;

        try {
            const formValid = this.formValidCheckers.reduce((memo, isValidFunc) => {
                return isValidFunc(true) && memo;
            }, true);
            if (formValid) {
                this.props.onSubmit(event, mutate, (err, res) => {
                    if (!err) {
                        this.setState({
                            msg: translate('request-form.succes-message'),
                        });
                    }
                    callback(err, res);
                });
            }
        } catch (error) {
            callback(translate('unknown-error'));
        }
    };

    onSubmit = (mutate) => (form, callback) => {
        this.setState({ error: false });

        const event = this.formToEvent(this.props.form);

        this.submitEvent(event, mutate, (err, res) => {
            console.log({ err, res });
            callback(err, res);
        });
    };

    hidePopup = () => {
        this.setState({
            showPopup: false,
        });
    };

    updateDate = (date) => {
        this.setState({ date: date });
    };
    updateLocation = ({ location, timezone }) => {
        this.setState({
            location: location,
            timeZoneId: timezone,
        });
    };

    setProgress = (step) => {
        if (step + 1 < this.state.activeStep) {
            this.setState({ activeStep: step + 1 });
        }
    };

    render() {
        const { translate } = this.props;
        const { error } = this.state;
        return (
            <Mutation
                mutation={CREATE_EVENT}
                onError={(error) => {
                    this.setState({ error });
                }}
            >
                {(mutate) => (
                    <div className="request-form">
                        <Popup
                            width="380px"
                            showing={this.state.showPopup && !this.props.isLoggedIn}
                            onClickOutside={this.hidePopup}
                        >
                            <div>
                                <p style={{ marginBottom: '20px' }}>
                                    {translate('request-form.email-exists-message')}
                                </p>
                                <Login
                                    redirect={false}
                                    onLogin={async (_) => {
                                        this.hidePopup();
                                    }}
                                />
                            </div>
                        </Popup>
                        <div className="request-columns">
                            <div className="row center">
                                {this.state.msg ? (
                                    <div className="col-md-8 thank-you-text">
                                        <p
                                            className="center"
                                            style={{
                                                fontSize: '32px',
                                                textAlign: 'center',
                                                lineHeight: '45px',
                                            }}
                                        >
                                            {this.state.msg}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="col-md-6">
                                        <Progress
                                            setProgress={this.setProgress}
                                            currentStep={this.state.activeStep - 1}
                                        />
                                        <div className="card">
                                            <div
                                                className={
                                                    ' ' +
                                                    (this.state.activeStep !== 1
                                                        ? 'hidden'
                                                        : 'show')
                                                }
                                            >
                                                <Step1
                                                    translate={translate}
                                                    form={this.props.form}
                                                    date={this.state.date}
                                                    updateDate={this.updateDate}
                                                    updateLocation={this.updateLocation}
                                                    next={() => this.setState({ activeStep: 2 })}
                                                    formValidCheckers={this.formValidCheckers}
                                                />
                                            </div>
                                            <div
                                                className={
                                                    ' ' +
                                                    (this.state.activeStep !== 2
                                                        ? 'hidden'
                                                        : 'show')
                                                }
                                            >
                                                <Step2
                                                    translate={translate}
                                                    form={this.props.form}
                                                    next={() => this.setState({ activeStep: 3 })}
                                                    back={() => this.setState({ activeStep: 1 })}
                                                    formValidCheckers={this.formValidCheckers}
                                                />
                                            </div>
                                            <div
                                                className={
                                                    ' ' +
                                                    (this.state.activeStep !== 3
                                                        ? 'hidden'
                                                        : 'show')
                                                }
                                            >
                                                {/* <Step3
                                                    translate={translate}
                                                    form={this.props.form}
                                                    date={this.state.date}
                                                    next={() => this.setState({ activeStep: 4 })}
                                                    back={() => this.setState({ activeStep: 2 })}
                                                    formValidCheckers={this.formValidCheckers}
                                                /> */}
                                            </div>
                                            <div
                                                className={
                                                    ' ' +
                                                    (this.state.activeStep !== 4
                                                        ? 'hidden'
                                                        : 'show')
                                                }
                                            >
                                                {/* <Step4
                                                    translate={translate}
                                                    form={this.props.form}
                                                    isLoggedIn={this.props.isLoggedIn}
                                                    active={this.state.activeStep === 2}
                                                    back={() => this.setState({ activeStep: 3 })}
                                                    submit={this.submit}
                                                    formValidCheckers={this.formValidCheckers}
                                                /> */}
                                                <form
                                                    noError
                                                    customIsFormValid={() => {
                                                        const result = this.formValidCheckers.reduce(
                                                            (memo, isValidFunc) => {
                                                                return isValidFunc(true) && memo;
                                                            },
                                                            true
                                                        );
                                                        return result;
                                                    }}
                                                    name="requestForm"
                                                >
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            marginTop: '20px',
                                                            marginBottom: '20px',
                                                        }}
                                                    >
                                                        <span
                                                            className="back-button"
                                                            onClick={() =>
                                                                this.setState({ activeStep: 3 })
                                                            }
                                                        >
                                                            {translate('back')}
                                                        </span>

                                                        <PrimaryButton
                                                            name="request_djs_button"
                                                            onClick={this.onSubmit(mutate)}
                                                            glow
                                                        >
                                                            <div style={{ width: '150px' }}>
                                                                {translate('get-offers')}
                                                            </div>
                                                        </PrimaryButton>
                                                    </div>
                                                    <ErrorMessageApollo
                                                        center
                                                        error={error}
                                                        onFoundCode={(code) => {
                                                            if (code === 'UNAUTHENTICATED') {
                                                                this.setState({
                                                                    showPopup: true,
                                                                    error: false,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <p
                                                        style={{ textAlign: 'center' }}
                                                        className="terms_link"
                                                    >
                                                        {translate('terms-message')}
                                                    </p>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Mutation>
        );
    }
};

export default addTranslate(MainForm, content);
