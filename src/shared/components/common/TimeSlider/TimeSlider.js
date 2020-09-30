import React, { useState, useEffect } from 'react';
import wNumb from 'wnumb';
import moment from 'moment-timezone';
import Slider from '../Slider/Slider';

const TimeSlider = ({
    onChange,
    startTime,
    endTime,
    hoursLabel,
    startLabel,
    endLabel,
    color,
    disabled,
    initialValues = [18 * 60, 24 * 60],
}) => {
    const [values, setValues] = useState(initialValues);

    useEffect(() => {
        if (startTime && endTime) {
            // parse and keep utc offset to get original hour and minute
            const date = moment.parseZone(startTime).startOf('day');
            const newStartTime = moment.parseZone(startTime);
            const newEndTime = moment.parseZone(endTime);

            setValues([newStartTime.diff(date, 'minutes'), newEndTime.diff(date, 'minutes')]);
        }
    }, [startTime, endTime]);

    const handleChange = (values) => {
        setValues(values);
        if (onChange) {
            onChange(values);
        }
    };

    const getValues = (values) => {
        return {
            startHour: Math.floor((values[0] / 60) % 24),
            endHour: Math.floor((values[1] / 60) % 24),
            startMinute: Math.floor(values[0] % 60),
            endMinute: Math.floor(values[1] % 60),
            difHours: (values[1] - values[0]) / 60,
        };
    };
    const { startHour, startMinute, difHours, endHour, endMinute } = getValues(values);
    const formatNumber = (num) => {
        return num < 10 ? '0' + num : String(num);
    };
    return (
        <div>
            <div>
                <Slider
                    disabled={disabled}
                    name="time"
                    range={{
                        min: 7 * 60,
                        max: 32 * 60,
                    }}
                    color={color}
                    step={30} //Steps of half hour
                    value={values}
                    onChange={handleChange}
                    format={wNumb({
                        decimals: 0,
                    })}
                />
            </div>
            <div
                className="time-slider-data"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                }}
            >
                <p>{`${startLabel}: ${formatNumber(startHour)}:${formatNumber(startMinute)}`}</p>
                <p>
                    <span>{`${difHours} ${hoursLabel}`}</span>
                </p>
                <p>{`${endLabel}: ${formatNumber(endHour)}:${formatNumber(endMinute)}`}</p>
            </div>
        </div>
    );
};

export default TimeSlider;
