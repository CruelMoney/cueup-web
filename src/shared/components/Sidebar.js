/* eslint-disable react/jsx-pascal-case */
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';

const Sticky = styled.div`
    position: sticky;
    top: ${({ stickyTop }) => stickyTop};
    margin-bottom: 42px;
    align-self: flex-start;
    z-index: 2;
    @media only screen and (max-width: 990px) {
        padding: 42px 0px 18px 0px;
    }
    @media only screen and (max-width: 425px) {
        display: none;
    }
`;

export const Spacing = styled.div`
    min-width: ${({ large }) => (large ? 470 : 300)}px;
    width: ${({ large }) => (large ? 470 : 300)}px;
    position: relative;
    @media only screen and (max-width: 900px) {
        min-width: ${({ large }) => (large ? 300 : 250)}px;
        width: ${({ large }) => (large ? 300 : 250)}px;
    }
    @media only screen and (max-width: 425px) {
        display: none;
    }
`;

const Card = styled.div`
    background-color: #fff;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    border-radius: 10px;
    overflow: hidden;
`;

const Shadow = styled.div`
    box-shadow: 0 0px 30px 0 rgba(0, 0, 0, 0.3);
    width: 90%;
    top: 0;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
    border-radius: 10px;
`;

export const SidebarContent = styled.div`
    padding: 24px;
`;

const Sidebar = ({ children, childrenBelow, large, ...props }) => {
    return (
        <Sticky className={'sidebar'} {...props}>
            <Spacing large={large}>
                <Card>{children}</Card>
                <Shadow />
            </Spacing>
            <div style={{ marginTop: '30px' }}>{childrenBelow}</div>
        </Sticky>
    );
};

export default Sidebar;
