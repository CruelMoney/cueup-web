import React, { Component } from 'react';
import { SecondaryButton } from 'components/Blocks';
import Checkmark from '../../assets/Checkmark';

class ToggleButton extends Component {
    static defaultProps = {
        label: 'ToggleButton',
    };

    onChange = (e) => {
        !!this.props.onChange && this.props.onChange(e.target.value);
    };

    render() {
        return (
            <SecondaryButton {...this.props} className="edit-text-button" onClick={null}>
                <input onChange={this.onChange} type="text" />
                <Checkmark
                    style={{
                        right: '6px',
                        top: '13px',
                        width: '15px',
                        height: '15px',
                        position: 'absolute',
                    }}
                    color="#50e3c2"
                />
            </SecondaryButton>
        );
    }
}

export default ToggleButton;
