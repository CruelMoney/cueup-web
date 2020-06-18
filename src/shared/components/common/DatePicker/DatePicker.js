import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.min.css';
import './index.css';

class MyDatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: props.initialDate ? moment(props.initialDate).toDate() : new Date(),
        };
    }

    handleChange = (date) => {
        this.props.handleChange(moment(date));
        this.setState({
            startDate: date,
        });
    };

    render() {
        const { minDate, dark, initialDate, ...rest } = this.props;
        return (
            <div
                style={{ color: '#32325d' }}
                className={'calendar-container' + (dark ? ' dark' : '')}
            >
                <DatePicker
                    inline
                    minDate={minDate !== undefined ? minDate : new Date()}
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    {...rest}
                />
            </div>
        );
    }
}

export default MyDatePicker;
