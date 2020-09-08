import React, { useCallback, useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.min.css';
import './index.css';
import { createGlobalStyle } from 'styled-components';
import { inputButtonStyle } from 'components/Blocks';

const MyDatePicker = ({ initialDate, minDate, dark, handleChange, ...props }) => {
    const [startDate, setStartDate] = useState(
        initialDate ? moment(initialDate).toDate() : new Date()
    );

    const onChange = useCallback(
        (date) => {
            handleChange(moment(date));
            setStartDate(date);
        },
        [handleChange]
    );

    return (
        <div style={{ color: '#32325d' }} className={'calendar-container' + (dark ? ' dark' : '')}>
            <GlobalStyle />
            <DatePicker
                inline
                minDate={minDate !== undefined ? minDate : new Date()}
                selected={startDate}
                onChange={onChange}
                {...props}
            />
        </div>
    );
};

const GlobalStyle = createGlobalStyle`

    .calendar-container{
        .react-datepicker__header__dropdown{
            display: flex;
            > * {
                flex: 1;
            }
        }
        select{
            ${inputButtonStyle}
            text-align: left;
        }


    }

`;

export default MyDatePicker;
