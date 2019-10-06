import React, { PureComponent } from 'react';
import moment from 'moment-timezone';
import { Mutation } from 'react-apollo';
import { SecondaryButton, Row } from '../../Blocks';
import { Input } from '../../FormComponents';
import LocationSelector from '../LocationSelectorSimple';
import Popup from '../Popup';
import DatePicker from '../Datepicker';
import { CHECK_DJ_AVAILABILITY } from './gql';

class Step1 extends PureComponent {
    state = {
        showPopup: false,
        date: moment(),
    };
    validationChecker = null;

    DateChanged = (date) => {
        this.setState({
            date: date,
            showPopup: false,
        });
        this.props.updateDate(date);
    };

    updateTimezone = (timezoneID) => {
        const newMoment = moment.tz(
            this.state.date.format('YYYY-MM-DDTHH:mm:ss'),
            'YYYY-MM-DDTHH:mm:ss',
            timezoneID
        );
        this.DateChanged(newMoment);
    };

    next = (mutate) => () => {
        const { translate } = this.props;
        if (this.validationChecker(true)) {
            this.setState({ loading: true });
            this.props.checkDjAvailability(
                { ...this.props.form, date: this.state.date.toDate() },
                mutate,
                (err, res, data) => {
                    this.setState({ loading: false });
                    if (err) {
                        this.setState({
                            loading: false,
                            err: typeof err === 'string' ? err : translate('unkown-error'),
                            msg: typeof err === 'string' ? err : '',
                        });
                    } else {
                        // DJs available
                        if (res === true) {
                            this.setState({
                                timeZoneId: data.timeZoneId,
                                loading: false,
                                msg: '',
                                err: '',
                            });
                            this.updateTimezone(data.timeZoneId);
                            this.props.updateLocation({
                                timezone: data.timeZoneId,
                                location: data.location,
                            });
                            this.props.next();

                            //not available
                        } else {
                            this.setState({
                                loading: false,
                                err: '',
                                msg: translate('request-form.no-djs-message'),
                            });
                        }
                    }
                }
            );
        }
    };

    render() {
        const { translate } = this.props;

        const eventDateString = this.state.date.format('dddd Do, MMMM YYYY');
        return (
            <Mutation mutation={CHECK_DJ_AVAILABILITY}>
                {(mutate) => {
                    return (
                        <>
                            <Popup
                                width="380px"
                                showing={this.state.showPopup}
                                onClickOutside={() => this.setState({ showPopup: false })}
                            >
                                <DatePicker
                                    dark
                                    initialDate={this.state.date}
                                    handleChange={this.DateChanged}
                                />
                            </Popup>
                            <form
                                registerCheckForm={(checker) => {
                                    this.validationChecker = checker;
                                    this.props.formValidCheckers.push(checker);
                                }}
                                //formValidCallback={(name)=>this.props.updateProgress(name,true)}
                                //formInvalidCallback={(name)=>this.props.updateProgress(name,false)}
                                name="requestForm-step-1"
                            >
                                <h3 className="center">
                                    {translate('request-form.step-1.header')}
                                </h3>
                                <section style={{ position: 'relative', zIndex: 5 }}>
                                    <LocationSelector
                                        name="location"
                                        label={translate('request-form.step-1.event-location')}
                                        placeholder={translate('city')}
                                        validate={['required']}
                                        value={
                                            this.props.initialCity !== ''
                                                ? this.props.initialCity
                                                : undefined
                                        }
                                    />
                                    <p>
                                        {translate(
                                            'request-form.step-1.event-location-description'
                                        )}
                                    </p>
                                </section>
                                <section
                                    className="cursor-pointer"
                                    onClick={() => {
                                        console.log('show');
                                        this.setState({ showLogin: false, showPopup: true });
                                    }}
                                >
                                    <label>{translate('request-form.step-1.event-date')}</label>
                                    <Input
                                        type="text"
                                        name="date"
                                        disabled
                                        onClick={() => {
                                            this.setState({ showLogin: false, showPopup: true });
                                        }}
                                        value={eventDateString}
                                    />
                                    <p>{translate('request-form.step-1.event-date-description')}</p>
                                </section>
                                <Row right>
                                    <SecondaryButton
                                        type="submit"
                                        isLoading={this.state.loading}
                                        onClick={this.next(mutate)}
                                    >
                                        {translate('continue')}
                                    </SecondaryButton>
                                </Row>
                            </form>

                            <p
                                style={{ marginTop: '5px' }}
                                className={this.state.err ? 'error center' : 'center'}
                            >
                                {this.state.err
                                    ? this.state.err
                                    : this.state.msg
                                    ? this.state.msg
                                    : null}
                            </p>
                        </>
                    );
                }}
            </Mutation>
        );
    }
}

export default Step1;
