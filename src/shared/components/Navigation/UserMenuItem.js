import React, { Component } from 'react';
import styled from 'styled-components';
import { Avatar } from 'components/Blocks';

const styles = {
    image: {
        width: '32px',
        height: '32px',

        position: 'relative',
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
    },
};

class UserMenuItem extends Component {
    render() {
        //Cut length if too long
        function getLabel(name) {
            if (name?.length > 20) {
                return name.substring(0, 20) + '...';
            }
            return name;
        }

        const { user, notifications, isInMenu } = this.props;

        const name = user.artistName || user.userMetadata.firstName;
        const picture = user.picture?.path;

        return (
            <MenuUser style={styles.flex} data-cy="menu-user-link" onClick={this.props.onClick}>
                <div style={styles.image}>
                    {notifications > 0 ? (
                        <div className={'notification-bubble'}>{notifications}</div>
                    ) : null}
                    <Avatar src={picture} />
                </div>
                <div
                    style={{
                        display: 'inline-block',
                        marginLeft: '9px',
                        color: isInMenu ? '#32325d' : 'inherit',
                    }}
                >
                    {getLabel(name)}
                </div>
                {!isInMenu && (
                    <DropDownArrow viewBox="0 0 24 24">
                        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                    </DropDownArrow>
                )}
            </MenuUser>
        );
    }
}

const MenuUser = styled.a`
    color: inherit;
    cursor: pointer;
    font-size: 17px;
    font-weight: 600;
    height: 32px;
    letter-spacing: 0.3px;
    line-height: 32px;
    display: flex;
    align-items: center;
    min-width: 200px;

    :hover {
        text-decoration: underline;
    }
`;

const DropDownArrow = styled.svg`
    color: inherit;
    display: inline-block;
    fill: inherit;
    height: 24px;
    right: 15px;
    top: 0px;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 24px;
`;

export default UserMenuItem;
