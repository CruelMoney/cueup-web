import React, { Component } from 'react';
import Button from './Button-v2';

class ToggleButton extends Component {
    constructor(props) {
        super(props);
        this.selfRef = React.createRef();
        this.state = {
            toggled: props.active,
            value: '',
        };
    }

    static defaultProps = {
        rounded: false,
        label: 'ToggleButton',
    };

    componentDidMount() {
        this.selfRef.current.focus();
        this.selfRef.current.addEventListener('keypress', (e) => {
            const key = e.which || e.keyCode;
            if (key === 13) {
                // 13 is enter
                !!this.props.onChange && this.props.onChange(this.state.value);
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.active !== undefined) {
            this.setState({
                toggled: nextProps.active,
            });
        }
    }

    onChange = (e) => {
        this.setState({ value: e.target.value });
        !!this.props.onChange && this.props.onChange(e.target.value);
    };

    render() {
        return (
            <Button
                {...this.props}
                className="edit-text-button"
                active={this.state.toggled}
                onClick={null}
            >
                <input onChange={this.onChange} ref={this.selfRef} type="text" />
            </Button>
        );
    }
}

export default ToggleButton;
