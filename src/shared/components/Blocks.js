import React from 'react';
import styled, { css, keyframes } from 'styled-components';
// npm install --save-dev @iconify/react @iconify/icons-ion
import { Icon, InlineIcon } from '@iconify/react';
import arrowForward from '@iconify/icons-ion/arrow-forward';
import arrowBack from '@iconify/icons-ion/arrow-back';

import GracefullImage from './GracefullImage';

export const Hr = styled.hr`
    border-bottom: 1px solid #e9ecf0;
    margin: 0;
    width: 100%;
    ${({ margin }) =>
        margin &&
        css`
            margin: 24px 0;
        `}
`;

export const MarginBottom = styled.div`
    margin-bottom: 48px;
`;

export const Container = styled.div`
    max-width: 1260px;
    width: 100%;
    margin: 0 auto;
    padding: 0 30px;
    @media only screen and (max-width: 768px) {
        padding: 0 15px;
    }
`;

export const Col = styled.div`
    display: ${({ tabletDown }) => (tabletDown ? 'none' : 'flex')};
    flex-direction: column;
    ${({ center }) => (center ? 'justify-content: center;' : '')}
    align-items: ${({ middle }) => (middle ? 'center' : 'auto')};
    @media only screen and (max-width: 768px) {
        display: ${({ mobileHide }) => (mobileHide ? 'none' : 'flex')};
    }
`;
export const HideBelow = styled.div`
    display: block;
    @media only screen and (max-width: ${({ width }) => width || 425}px) {
        display: none;
    }
`;
export const ShowBelow = styled.div`
    display: none;
    @media only screen and (max-width: ${({ width }) => width || 425}px) {
        display: block;
    }
`;

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: ${({ center, right, between, around }) =>
        center
            ? 'center'
            : right
            ? 'flex-end'
            : between
            ? 'space-between'
            : around
            ? 'space-around'
            : 'flex-start'};
    align-items: ${({ middle }) => (middle ? 'center' : 'flex-start')};
    > button,
    > a {
        margin-left: 9px;
        &:first-child {
            margin-left: 0;
        }
    }
    ${({ fullWidth }) =>
        fullWidth &&
        css`
            > button,
            > a {
                margin: 0;
                max-width: 100%;
            }
        `}
`;

export const RowWrap = styled(Row)`
    flex-wrap: wrap;
`;

export const RowMobileCol = styled(Row)`
    @media only screen and (max-width: 425px) {
        flex-direction: ${({ reverse }) => (reverse ? 'column-reverse' : 'column')};
        button {
            max-width: 100%;
            width: 100%;
        }
    }
`;

export const FullWidthCol = styled(Col)`
    width: 100%;
`;

export const Divider = styled.hr`
    border-top: 1px solid #e9ecf0;
    margin: 24px 0;
`;

const tertiaryStyle = css`
    font-weight: 600;
    font-size: 12px;
    color: #4d6480;
    letter-spacing: 1.04px;
`;

export const ReadMoreText = styled.span`
    ${tertiaryStyle}
    text-align: left;
`;

const ButtonIcon = styled.span`
    margin-left: 15px;
    top: 3px;
    display: inline-block;
    transition: transform 200ms ease;
    ${ReadMoreText}:hover & {
        transform: translateX(3px);
    }
`;

const ButtonIconBack = styled.span`
    margin-right: 15px;
    top: 3px;
    display: inline-block;
    transition: transform 200ms ease;
    ${ReadMoreText}:hover & {
        transform: translateX(-3px);
    }
`;

export const ReadMore = ({
    color,
    children,
    back,
    style = {},
    center,
    uppercase = true,
    size,
    white,
    ...props
}) => {
    if (white) {
        color = '#fff';
    }
    if (color) {
        style.color = color;
    }

    if (center) {
        style = {
            textAlign: 'center',
            margin: 'auto',
            ...style,
        };
    }

    if (size) {
        style.fontSize = size;
    }

    if (uppercase) {
        style.textTransform = 'uppercase';
    }

    return (
        <ReadMoreText style={style} {...props}>
            {!back && children}
            {back ? (
                <ButtonIconBack>
                    <Icon
                        icon={arrowBack}
                        style={{ fontSize: size ?? '15px' }}
                        color={color || '#4d6480'}
                    />
                </ButtonIconBack>
            ) : (
                <ButtonIcon>
                    <Icon
                        icon={arrowForward}
                        style={{ fontSize: size ?? '15px' }}
                        color={color || '#4d6480'}
                    />
                </ButtonIcon>
            )}
            {back && children}
        </ReadMoreText>
    );
};

export const ReadMoreButton = ({ children, onClick, color, style, back }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: 0,
                border: 'none',
                display: 'inline-block',
                marginRight: 'auto',
                ...style,
            }}
        >
            <ReadMore back={back} color={color}>
                {children}
            </ReadMore>
        </button>
    );
};

const avatarSizes = {
    extraLarge: '114px',
    large: '60px',
    small: '30px',
};

const AvatarWrapper = styled.div`
    box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: ${({ size }) => avatarSizes[size] || '30px'};
    min-width: ${({ size }) => avatarSizes[size] || '30px'};
    min-height: ${({ size }) => avatarSizes[size] || '30px'};
    height: ${({ size }) => avatarSizes[size] || '30px'};
    overflow: hidden;
    position: relative;
`;

export const Avatar = ({ size, style, className, src, ...props }) => (
    <AvatarWrapper
        size={size}
        style={{
            objectFit: 'cover',
            ...style,
        }}
        className={className}
    >
        <GracefullImage
            {...props}
            src={src}
            style={{
                objectFit: 'cover',
                height: avatarSizes[size] || '30px',
                width: avatarSizes[size] || '30px',
                minHeight: avatarSizes[size] || '30px',
                minWidth: avatarSizes[size] || '30px',
                top: 0,
                position: 'absolute',
                left: 0,
                zIndex: -1,
                borderRadius: '50%',
            }}
        />
    </AvatarWrapper>
);

export const Hide = styled.div`
    @media only screen and (max-width: ${({ maxWidth }) => maxWidth}) {
        display: none;
    }
`;

export const Show = styled.div`
    display: none;
    @media only screen and (max-width: ${({ maxWidth }) => maxWidth}) {
        display: block;
    }
`;

export const inputStyle = css`
    background: ${({ primary }) => {
        if (primary) {
            return;
        }
        return '#f6f8f9';
    }};
    border-radius: 0.222em;
    border: none;
    outline: none;
    font-size: 1em;
    color: #122b48;
    text-indent: 0.5em;
    height: 2.222em;
    -webkit-appearance: none;
    width: 100%;
    display: block;
    font-weight: 400;
    box-shadow: ${({ attention, error }) => {
        const show = attention || error;
        const color = error ? '#D0021B' : '#FFC800';
        return show ? `inset 0 0 0 2px ${color}` : 'none';
    }};

    ::placeholder,
    ::-webkit-input-placeholder {
        color: #98a4b3;
    }
    :-ms-input-placeholder {
        color: #98a4b3;
    }

    :focus {
        background: #e9ecf0;
    }

    ${({ big }) =>
        big &&
        css`
            font-size: 1.5em;
        `}
`;

export const TextInput = styled.input`
    ${inputStyle}
    text-indent: 9px;
`;

export const FileInput = styled.input.attrs({ type: 'file' })`
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
`;

const ButtonTextStyle = css`
    font-weight: 600;
    font-size: 15px;
    color: #4d6480;
    text-align: center;
    line-height: 20px;
    background: transparent;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    min-width: ${({ small }) => (small ? '130px' : '150px')};
    padding: 0 1em;
    height: ${({ small }) => (small ? '30px' : '40px')};
    ${({ disabled }) => (disabled ? 'opacity: 0.5;' : '')}
    overflow: hidden;
    white-space: nowrap;
    display: block;
    text-overflow: ellipsis;
    max-width: 200px;
    position: relative;
    ${({ flex }) =>
        flex &&
        css`
            display: flex;
            justify-content: center;
            align-items: center;
        `}
`;

const inputButtonStyle = css`
    ${inputStyle}
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    line-height: 40px !important;
    transition: all 200ms ease;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: ${({ attention, error }) => {
        const show = attention || error;
        const color = error ? '#D0021B' : '#FFC800';
        return show ? `inset 0 0 0 2px ${color}` : 'none';
    }};

    :hover {
        ${({ warning, disabled }) =>
            disabled
                ? ''
                : warning
                ? `background: #D0021B;
      color: white;
    `
                : `background: #e9ecf0;
    `};
    }
    :focus {
        background: #e9ecf0;
    }
`;

export const ButtonInput = styled.button`
    ${inputButtonStyle}
`;
export const Select = styled.select`
    ${inputButtonStyle}
`;
export const FileInputWrapper = styled.label`
    ${inputButtonStyle}
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: block;
`;

export const TeritaryButton = styled.button`
    ${ButtonTextStyle} :hover {
        ${({ disabled, warning }) =>
            disabled
                ? ''
                : warning
                ? `
				background: #D0021B;
				color: white;
				`
                : `
			background: #f6f8f9;
		`}
    }
`;

export const secondaryButtonStyle = css`
    ${ButtonTextStyle}
    background: ${({ muted }) => (muted ? '#f6f8f9' : '#E9ECF0')};
    margin-bottom: 0;
    :hover {
        ${({ disabled, warning }) =>
            disabled
                ? ''
                : warning
                ? `
				background: #D0021B;
				color: white;
				`
                : `
			background: #e1e5ea;
		`}
    }
`;

export const SecondaryButton = styled.button`
    ${secondaryButtonStyle}
`;
export const SecondaryButtonLink = styled.a`
    ${secondaryButtonStyle}
    line-height: 40px;
`;

export const PrimaryButton = styled.button.attrs(({ loading, ...props }) => props)`
    ${ButtonTextStyle}
    color: ${({ invert }) => (invert ? '#31daff' : '#fff')};
    background:  ${({ invert }) => (invert ? '#fff' : '#31daff')}; 
    opacity: ${({ loading }) => (loading ? 0.5 : 1)};
    pointer-events: ${({ loading }) => (loading ? 'none' : 'auto')};
    :hover {
        color: ${({ invert }) => (invert ? '#31daff' : '#fff')};
        background-color: ${({ invert }) => (invert ? '#fff' : '#00d1ff')};
    }
    ${({ disabled }) => (disabled ? 'opacity: 0.5;' : '')}
`;

export const LinkButton = styled(TeritaryButton)`
    padding: 0;
    min-width: 0;
    /* width: auto; */
    text-align: left;
    display: inline-block;
    margin-right: auto;
    height: 18px;
    background: transparent !important;
`;

export const AddButton = LinkButton;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const LoadingIndicator = styled.span`
    height: 24px;
    width: 24px;
    border: 3px solid #fff;
    border-radius: 50%;
    animation: ${rotate} 1s linear infinite;
    display: block;
    border-color: currentColor currentColor currentColor transparent;
`;

export const GradientBg = styled.section`
    height: 318px;
    background: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%),
        ${({ coverPhoto }) =>
                coverPhoto
                    ? `url(${coverPhoto.path})`
                    : 'linear-gradient(-56deg, #31fff5 0%, #31ffc5 11%, #00d1ff 80%, #32daff 87%)'}
            no-repeat center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    flex: 1;
    display: flex;
    align-items: flex-end;
    position: sticky;
    top: -270px;
    z-index: 1;

    @media only screen and (max-width: 425px) {
        min-height: 290px;
        height: auto;
        position: relative;
        top: 0;
        padding-top: 100px;
    }
    .iconRow {
        color: #fff;
        margin-bottom: 0;
        &:first-child {
            margin-right: 30px;
        }
        svg {
            margin-right: 6px;
        }
    }
`;

export const keyframeFadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }

`;

const buttons = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    tertiary: TeritaryButton,
    input: ButtonInput,
};

export const SmartButton = ({
    level = 'primary',
    onClick,
    children,
    loading,
    warning,
    disabled,
    style,
    success,
    ...props
}) => {
    const Button = buttons[level];

    const handleClick = (e) => {
        if (onClick) {
            if (warning && typeof warning === 'string') {
                const confirmed = window.confirm(warning);
                if (confirmed) {
                    onClick(e);
                }
            } else {
                onClick(e);
            }
        }
    };

    return (
        <Button
            onClick={handleClick}
            warning={warning}
            disabled={disabled || loading || success}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                ...style,
            }}
            {...props}
        >
            <span>{children}</span>
            {loading && (
                <span
                    style={{
                        float: 'right',
                        marginLeft: '15px',
                    }}
                >
                    <LoadingIndicator />
                </span>
            )}
        </Button>
    );
};

export const Pill = styled.span`
    font-weight: 600;
    font-size: 9px;
    color: #4d6480;
    letter-spacing: 0.75px;
    background-color: #e9ecf0;
    padding: 0 6px;
    height: 18px;
    text-transform: uppercase;
    border-radius: 33px;
    text-align: center;
    line-height: 18px;
`;

export const PillLarge = styled.span`
    font-size: 12px;
    background-color: #e9ecf0;
    color: #98a4b3;
    padding: 0 15px;
    height: 24px;
    border-radius: 33px;
    text-align: center;
    line-height: 24px;
    font-weight: 600;
`;

export const InfoBox = styled.div`
    background: rgba(233, 236, 240, 0.5);
    border-radius: 1em;
    max-height: 8em;
    min-height: ${({ minHeight }) => (minHeight ? 70 : 0)}px;
    width: 8em;
    padding: 1em;
    font-weight: 700;
    font-size: 13px;
    color: #4d6480;
    text-align: center;
    text-transform: capitalize;
    display: inline-block;
    text-transform: capitalize;
    margin-right: 24px;
    margin-bottom: 24px;
    @media only screen and (max-width: 425px) {
        margin-right: 15px;
    }

    span {
        color: #98a4b3;
        display: block;
        margin-bottom: 3px;
    }
`;

export const InfoPill = styled.span`
    font-weight: 700;
    background: #e9ecf0;
    border-radius: 16px;
    height: 24px;
    margin-bottom: 0;
    line-height: 24px;
    min-width: 130px;
    max-width: 200px;
    font-size: 12px;
    color: #98a4b3;
    text-align: center;
    padding: 0 0.75em;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 9px;
    margin-bottom: 9px;

    span {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    svg {
        margin-right: 5px;
        position: relative;
    }
`;

export const Card = styled.div`
    display: flex;
    overflow: hidden;
    flex-direction: row;
    border-radius: 4px;
    flex-wrap: wrap;
    background: #fff;
    z-index: 1;
    flex: 1;
`;

export const CardShadow = styled.div`
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 15px;
    left: 10px;
    bottom: 10px;
    right: 10px;
`;
