import React, { useState, useRef } from 'react';
import moment from 'moment-timezone';
import { Input } from '../components/FormComponents';

import Popup from './common/Popup';
import DatePicker from './common/DatePicker';
import { useValidation } from './hooks/useForm';

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
    buttonText,
    removable,
    ...props
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
                className={selectedDate ? 'date-picker' : 'date-picker empty'}
                disabled={disabled}
                error={error}
                half={half}
                type="button"
                name="date"
                onClick={() => {
                    setShowing(true);
                }}
                onChange={() => {
                    setDate(null);
                    onSave(null);
                }}
                label={label}
                buttonText={
                    selectedDate
                        ? moment(selectedDate).format('DD/MM/YYYY')
                        : buttonText || 'Select'
                }
                ref={ref}
                removable={selectedDate && removable}
                {...props}
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
