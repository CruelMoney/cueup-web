/* eslint-disable react/jsx-pascal-case */

import styled, { css } from 'styled-components';
import { Icon } from '@iconify/react';
import arrowForward from '@iconify/icons-ion/arrow-forward';
import React, { useCallback, useEffect } from 'react';
import { LoadingIndicator } from './Blocks';

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
    border-radius: 8px;
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

const CTA = styled.button`
    height: 60px;
    box-sizing: border-box;
    background: linear-gradient(to right, #02abd0 0%, #00b5dd 50%, #31daff 100%) !important;
    border: none;
    outline: none;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff !important;
    text-align: left;
    display: flex;
    width: calc(100% - 20px);
    align-items: center;
    transition: all 250ms ease;
    position: relative;
    touch-action: manipulation !important;
    border-radius: 8px;
    margin: 10px;
    &:hover {
        color: #ffffff !important;
        background-color: ${({ disabled }) => (disabled ? '#31daff' : '#00d1ff')};
        ${InnerGradient} {
            opacity: 1;
        }
    }
    &:disabled {
        cursor: default;
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
            {!loading && <span style={{ pointerEvents: 'none', margin: 'auto' }}>{children} </span>}
            {loading && <LoadingIndicator style={{ margin: 'auto' }} />}
        </CTA>
    );
};
