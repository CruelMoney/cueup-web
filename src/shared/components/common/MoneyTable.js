import React, { Component } from 'react';
import InfoPopup from './InfoPopup';

class TableItem extends Component {
    state = {};
    render() {
        const { payLater, bold } = this.props;
        return (
            <div
                style={{ fontWeight: bold ? '600' : 'normal' }}
                className={'pay-fact ' + (payLater ? 'pay-later' : '')}
            >
                <span>
                    <p style={{ float: 'left' }}>{this.props.label}</p>
                    {this.props.info && <InfoPopup info={this.props.info} />}
                </span>
                {this.props.children}
            </div>
        );
    }
}

export { TableItem };

class MoneyTable extends Component {
    state = {};
    render() {
        return <div className="pay-info">{this.props.children}</div>;
    }
}

export default MoneyTable;
