/* eslint-disable react/jsx-pascal-case */
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Icon, InlineIcon } from '@iconify/react';
import arrowForward from '@iconify/icons-ion/arrow-forward';
import useMouse from '@react-hook/mouse-position';
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
    box-shadow: 0 0px 30px 0 rgba(0, 0, 0, 0.3);
    width: 90%;
    top: 0;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 0;
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

const GradientMouseAnimation = styled.span`
    position: absolute !important;
    inset: 0px !important;
    left: 0;
    top: 0;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    mask-image: -webkit-radial-gradient(white, black) !important;
`;

const InnerGradient = styled.span`
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    min-width: 200px !important;
    background-size: 200% 200% !important;
    opacity: 0;
    transition: opacity 1.25s ease 0s !important;
    background-image: radial-gradient(
        circle at center,
        hsl(191 100% 61% / 1) 0%,
        #31daff 27.5%,
        #1ad5ff 40%,
        #00caf7 57.5%,
        #00b5dd 75%,
        #02abd0 100%
    ) !important;
    background-position: calc((100 - var(--mouse-x, 0)) * 1%) calc((100 - var(--mouse-y, 0)) * 1%);
`;

const CTAIcon = styled.div`
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 250ms ease;
    pointer-events: none;
`;

const CTA = styled.button`
    width: 100%;
    height: 60px;
    background: linear-gradient(to right, #02abd0 0%, #00b5dd 50%, #31daff 100%) !important;
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
    touch-action: manipulation !important;
    &:hover {
        color: #ffffff !important;
        background-color: ${({ disabled }) => (disabled ? '#31daff' : '#00d1ff')};
        ${CTAIcon} {
            transform: translate(3px, -50%);
        }
        ${InnerGradient} {
            opacity: 1;
        }
    }
`;

const useRelativeMousePosition = (ref) => {
    const handleMouseMove = useCallback(
        (evt) => {
            let x = evt.offsetX;
            let y = evt.offsetY;
            x = (x / ref.current.clientWidth) * 100;
            y = (y / ref.current.clientHeight) * 100;

            ref.current.style.setProperty('--mouse-x', x);
            ref.current.style.setProperty('--mouse-y', y);
        },
        [ref]
    );

    useEffect(() => {
        const btn = ref.current;
        btn.addEventListener('mousemove', handleMouseMove);
        return () => {
            btn.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove, ref]);
};

export const CTAButton = ({ children, loading, ...props }) => {
    const ref = React.useRef(null);
    useRelativeMousePosition(ref);
    return (
        <CTA {...props}>
            <GradientMouseAnimation>
                <InnerGradient ref={ref} />
            </GradientMouseAnimation>
            <span style={{ pointerEvents: 'none' }}>{children} </span>
            <CTAIcon>
                {loading ? (
                    <LoadingIndicator />
                ) : props.disabled ? null : (
                    <Icon icon={arrowForward} style={{ fontSize: '1.5em' }} color="#fff" />
                )}
            </CTAIcon>
        </CTA>
    );
};

export default Sidebar;
