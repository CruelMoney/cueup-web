import React, { useState, useRef } from 'react';
import moment from 'moment-timezone';
import { Input, useValidation } from '../components/FormComponents';

import Popup from './common/Popup';
import DatePicker from './common/Datepicker';

const DatePickerPopup = ({
    initialDate,
    onSave,
    label,
    half,
    showMonthDropdown = true,
    showYearDropdown = true,
    maxDate = new Date(),
    minDate,
    validation,
    registerValidation,
    unregisterValidation,
    disabled,
}) => {
    const ref = useRef();
    const [showing, setShowing] = useState(false);
    const [selectedDate, setDate] = useState(initialDate ? moment(initialDate) : null);

    const { error, runValidation } = useValidation({
        validation,
        registerValidation,
        unregisterValidation,
        ref,
    });

    const save = (moment) => {
        setShowing(false);
        if (!runValidation(moment)) {
            setDate(moment);
            onSave(moment.toDate());
        }
    };

    return (
        <>
            <Input
                disabled={disabled}
                error={error}
                half={half}
                type="button"
                onClick={() => {
                    setShowing(true);
                }}
                label={label}
                buttonText={selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : 'Select'}
                ref={ref}
            />
            <Popup
                width="380px"
                showing={showing}
                onClickOutside={() => {
                    setShowing(false);
                    runValidation(selectedDate);
                }}
            >
                <DatePicker
                    dark
                    initialDate={initialDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    handleChange={save}
                    showMonthDropdown={showMonthDropdown}
                    showYearDropdown={showYearDropdown}
                    dropdownMode="select"
                />
            </Popup>
        </>
    );
};

export default DatePickerPopup;
