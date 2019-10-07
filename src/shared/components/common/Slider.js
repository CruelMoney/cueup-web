import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RCSlider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

/**
 * The slider bar can have a set minimum and maximum, and the value can be
 * obtained through the value parameter fired on an onChange event.
 */
class Slider extends Component {
    static propTypes = {
        name: PropTypes.string,
        value: PropTypes.arrayOf(PropTypes.number),
        range: PropTypes.object,
        step: PropTypes.number,
        handleChange: PropTypes.func,
        format: PropTypes.object,
    };

    constructor(props) {
        super(props);
        // Range should be an object consisting of at least min & max
        // May consist of percentage values in what case it is a nonlinear scale
        if (Object.keys(props.range).length > 2) {
            //nonlinear
            this.parsedRange = this.parseRange(props.range);
            this.nonLinear = true;
        }
    }
    defaultValue = 0;
    nonLinear = false;
    parsedRange = [];

    parseRange = (range) => {
        const newRange = [];
        Object.keys(this.props.range).map((k) => {
            if (k === 'min') {
                newRange.push([0, this.props.range.min]);
            } else if (k === 'max') {
                newRange.push([100, this.props.range.max]);
            } else {
                const perc = parseInt(k, 10);
                if (isNaN(perc)) {
                    throw new Error('Range not valid');
                }
                newRange.push([perc, this.props.range[k]]);
            }
            return null;
        });
        newRange.sort((a, b) => a[0] - b[0]);
        return newRange;
    };

    //Helper functions
    getPercentage(max, min, val) {
        const newMax = max - min; //50
        const newVal = val - min; //25
        return (newVal / newMax) * 100;
    }
    getValue(max, min, perc) {
        const newMax = max - min;
        const res = Math.floor((newMax / 100) * perc + min);
        return isNaN(res) ? 1 : res;
    }

    handleNonLinear = (val) => {
        //calculate the percentage of the max value
        //Find the range it falls between
        //calculate linear between those
        const perc = this.getPercentage(this.props.range.max, this.props.range.min, val);

        const withinRange = []; //Array of 2 arrays [[val, perc][val, perc]]
        withinRange[0] = []; //the value it is above
        withinRange[1] = []; //the value it is below

        this.parsedRange.reduce((last, current, index, arr) => {
            //still not in the range
            if (current[0] < perc) {
                return current;
            } else if (last[0] < perc) {
                //the range has been found
                withinRange[0][0] = last[0];
                withinRange[0][1] = last[1];
                withinRange[1][0] = current[0];
                withinRange[1][1] = current[1];
                return current;
            }
            return current;
        });

        //recalculate percentage to between the new range
        const middlePerc = this.getPercentage(
            withinRange[1][0], //max
            withinRange[0][0], //min
            perc
        );

        return this.getValue(withinRange[1][1], withinRange[0][1], middlePerc);
    };

    handleChange = (values) => {
        values = Array.isArray(values) ? values : [values];

        if (this.nonLinear) {
            values = values.map(this.handleNonLinear);
        }
        this.props.onChange(values);
    };

    render() {
        const color = this.props.color || '#25F4D2';
        return (
            <div
                style={{
                    visibility: 'hidden',
                    display: 'flex',
                    backgroundColor: color,
                    borderColor: color,
                }}
            >
                {this.props.value.length > 1 ? (
                    <Range
                        disabled={this.props.disabled}
                        min={this.props.range.min}
                        max={this.props.range.max}
                        step={this.props.step}
                        defaultValue={this.props.value}
                        onChange={this.handleChange}
                    />
                ) : (
                    <RCSlider
                        disabled={this.props.disabled}
                        min={this.props.range.min}
                        max={this.props.range.max}
                        step={this.props.step}
                        defaultValue={this.props.value[0]}
                        onChange={this.handleChange}
                    />
                )}
            </div>
        );
    }
}

Slider.contextTypes = {
    color: PropTypes.string,
};

export default Slider;
