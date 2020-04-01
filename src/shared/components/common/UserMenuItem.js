import React, { Component } from 'react';
import { Avatar } from '../Blocks';

class UserMenuItem extends Component {
    render() {
        //Cut length if too long
        function getLabel(name) {
            if (name?.length > 20) {
                return name.substring(0, 20) + '...';
            }
            return name;
        }

        const styles = {
            image: {
                width: '30px',
                height: '30px',

                position: 'relative',
            },
            flex: {
                display: 'flex',
                alignItems: 'center',
            },
        };

        return (
            <div className="menu-user" style={styles.flex} data-cy="menu-user-link">
                <div style={styles.image}>
                    {this.props.notifications > 0 ? (
                        <div className={'notification-bubble'}>{this.props.notifications}</div>
                    ) : null}
                    <Avatar src={this.props.picture} />
                </div>
                <div style={{ display: 'inline-block', marginLeft: '9px' }}>
                    {getLabel(this.props.name)}
                </div>
            </div>
        );
    }
}

export default UserMenuItem;
