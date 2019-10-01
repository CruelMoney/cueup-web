import React, { Component } from 'react';
import InfoPopup from './InfoPopup';

class TableItem extends Component {
    state = {};
    render() {
        return (
            <div className="pay-fact">
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
