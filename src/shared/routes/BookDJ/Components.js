import React from 'react';
import styled, { css } from 'styled-components';
import { Label } from 'components/FormComponents';
import { Container, RowWrap } from 'components/Blocks';
import { CTAButton } from 'components/CTAButton';
import { H3 } from 'components/Text';

export const HeroCard = styled.div`
    padding: 1.5em;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 6px 21px 0 rgba(18, 43, 72, 0.2);
    position: relative;
    z-index: 1;
    max-width: 450px;
    min-width: 370px;
    display: inline-block;
    margin: auto 0;
    @media only screen and (max-width: 744px) {
        max-width: 100%;
        box-shadow: none;
        padding: 0;
        width: 100% !important;
        min-width: 0;
    }
`;

export const StyledLabelComponent = styled.div`
    border: 1px solid #e9ecf0;
    border-radius: 8px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    position: relative;

    label {
        margin-top: 8px;
        margin-bottom: 0;
        > span {
            margin-bottom: -4px;
            & ~ * {
                margin-top: -4px;
            }
        }

        input,
        button {
            background-color: transparent;

            &:focus,
            &:hover {
                background: inherit;
            }
        }
    }

    .divider {
        width: 1px;
        background-color: #e9ecf0;
        height: 40px;
    }
    ul {
        top: -12px;
        left: -12px;
        right: -12px;
        padding-top: 4em;
        box-shadow: none;
        border: 1px solid #e9ecf0;
        border-radius: 8px;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .powered-by-google {
        top: 0.7em !important;
        display: flex;
        right: 0.7em !important;
    }
`;

export const ImageWrapper = styled.div`
    border-radius: 2.5%;
    overflow: hidden;
    position: relative;
    img,
    picture,
    div {
        position: absolute;
        object-fit: cover;
        height: 100%;
        width: 100%;
    }
    :after {
        content: '';
        display: block;
        padding-top: 100%;
    }
`;

export const HeroImageWrapper = styled.div`
    width: 75%;
    height: 100%;
    max-height: 470px;
    border-radius: 20px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    overflow: hidden;
    div,
    img,
    picture {
        object-fit: cover;
        height: 100%;
        width: 100%;
        display: block;
    }
    @media only screen and (max-width: 744px) {
        display: none;
    }
`;

export const CustomSection = styled.section`
    margin-bottom: 60px;
    position: relative;
    width: 100%;
`;

export const HeroSection = styled(CustomSection)`
    min-height: 470px;
    display: flex;
    @media only screen and (max-width: 744px) {
        min-height: 0;
        margin-top: 15px;
    }
`;

export const MapWrapper = styled.div`
    border-radius: 20px;
    pointer-events: none;
    overflow: hidden;
    background-color: #fff;
    width: 100%;
    height: 470px;
    position: relative;
    box-shadow: 0 6px 65px 0 rgba(18, 43, 72, 0.15);
    @media only screen and (max-width: 744px) {
        height: 250px;
    }
`;

export const BreadCrumbsList = styled.ol`
    margin: 0;
    padding: 0;
    list-style: none;
    li {
        display: inline-block;
    }
    a {
        padding: 0 6px;
    }
    li:first-child a {
        padding-left: 0;
    }
    a:hover {
        text-decoration: underline;
    }
    a.current {
        pointer-events: none;
        cursor: default;
    }
    .breadcrumb-arrow {
        pointer-events: none;
        user-select: none;
        white-space: pre-wrap;
        padding-left: 0px;
        padding-right: 0px;
        font-size: 18px;
    }
`;

export const BreadCrumbs = ({ items }) => {
    return (
        <BreadCrumbsList
            itemScope=" "
            itemType="https://schema.org/BreadcrumbList"
            aria-label="breadcrumb"
        >
            {items.map(({ url, label }, idx) => (
                <li
                    key={url}
                    itemProp="itemListElement"
                    itemScope=" "
                    itemType="https://schema.org/ListItem"
                >
                    <meta itemProp="position" content={idx + 1} />
                    {idx > 0 && (
                        <span className="breadcrumb-arrow" aria-hidden="true">
                            {' '}
                            ›{' '}
                        </span>
                    )}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={encodeURI(url)}
                        itemType="https://schema.org/Thing"
                        itemProp="item"
                        className={idx === items.length - 1 ? 'current' : ''}
                    >
                        <span itemProp="name">{label}</span>
                    </a>
                </li>
            ))}
        </BreadCrumbsList>
    );
};

export const CustomCTAButton = styled(CTAButton)`
    width: 100%;
    border-radius: 8px;
    margin: 0;
    height: 55px;
    margin-top: 6px;
    justify-content: center;
    padding: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0;
`;

export const GreyBox = styled.section`
    background-color: #f7f9fc;
    border-radius: 12px;
    width: 100%;
    padding: 20px;
    margin-bottom: 15px;
    position: relative;
    display: flex;
    flex-direction: column;

    label,
    ${Label} {
        > input,
        > button,
        > textarea {
            background-color: white;
        }
    }

    ul {
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        padding: 7px;
        padding-top: 5em;
        box-shadow: none;
        border: 1px solid #e9ecf0;
        border-radius: 12px;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .powered-by-google {
        top: 1em !important;
        display: flex;
        right: 1em !important;
    }
`;

export const ResponsiveRow = styled.ol`
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(3, 1fr);
    padding: 0;
    list-style: none;

    @media only screen and (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-row-gap: 30px;
    }
`;

export const ResponsiveRowFour = styled(ResponsiveRow)`
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 30px;
    @media only screen and (max-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
        grid-row-gap: 30px;
    }
    @media only screen and (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-row-gap: 30px;
    }
`;

export const ResponsiveCell = styled.li`
    flex: 1;
    cursor: pointer;
    ${H3} {
        margin-top: 0.6em;
    }
    ${({ v2 }) =>
        v2 &&
        css`
            background-color: #fff;
            border-radius: 2.5%;
            box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.06), 0 13px 13px 0 rgba(0, 0, 0, 0.08),
                0 20px 15px 0 rgba(0, 0, 0, 0.04);
            overflow: hidden;
            > ${ImageWrapper} {
                border-radius: 0;
            }
            > .content {
                padding: 0 15px 15px 15px;
            }
        `}
`;

export const TopLocationsGrid = styled.ol`
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(5, 1fr);
    padding: 0;
    list-style: none;
    a:hover {
        text-decoration: underline;
    }
    @media only screen and (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        grid-row-gap: 30px;
        grid-gap: 9px;
    }
`;
