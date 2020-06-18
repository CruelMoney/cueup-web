/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import styled from 'styled-components';
import { Icon, InlineIcon } from '@iconify/react';
import arrowForward from '@iconify/icons-ion/arrow-forward';
import { LoadingIndicator } from './Blocks';

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
`;

const Shadow = styled.div`
    box-shadow: 0 2px 50px 0 rgba(0, 0, 0, 0.5);
    width: 85%;
    height: 94%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
`;

export const SidebarContent = styled.div`
    padding: 24px;
`;

const Sidebar = ({ children, showCTAShadow, childrenBelow, large, ...props }) => {
    return (
        <Sticky className={'sidebar'} {...props}>
            <Spacing large={large}>
                <Card>{children}</Card>
                <Shadow />
                {showCTAShadow ? <CTAShadow /> : null}
            </Spacing>
            <div style={{ marginTop: '30px' }}>{childrenBelow}</div>
        </Sticky>
    );
};

const CTAIcon = styled.div`
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 250ms ease;
`;

const CTA = styled.button`
    width: 100%;
    height: 60px;
    background-color: #31daff;
    border: none;
    outline: none;
    font-weight: 700;
    font-size: 15px;
    color: #ffffff !important;
    letter-spacing: 1.2px;
    text-align: left;
    padding-left: 24px;
    display: flex;
    align-items: center;
    transition: all 250ms ease;
    position: relative;
    &:hover {
        color: #ffffff !important;
        background-color: ${({ disabled }) => (disabled ? '#31daff' : '#00d1ff')};
        ${CTAIcon} {
            transform: translate(3px, -50%);
        }
    }
`;

export const CTAButton = ({ children, loading, ...props }) => (
    <CTA {...props}>
        {children}{' '}
        <CTAIcon>
            {loading ? (
                <LoadingIndicator />
            ) : props.disabled ? null : (
                <Icon icon={arrowForward} style={{ fontSize: '1.5em' }} color="#fff" />
            )}
        </CTAIcon>
    </CTA>
);

export const CTAShadow = styled.div`
    box-shadow: 0px -20px 50px 20px #26deff;
    position: absolute;
    width: 100%;
    height: 0%;
    bottom: 0;
`;

export default Sidebar;
