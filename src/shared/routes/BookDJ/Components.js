import React from 'react';
import styled from 'styled-components';
import { Label } from 'components/FormComponents';
import { Container } from 'components/Blocks';
import { CTAButton } from 'components/CTAButton';

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
    label,
    ${Label} {
        flex: 1;
        min-width: 0;
        color: #32325d;
        font-weight: 600;
        letter-spacing: 0.08em;
        font-size: 10px;
        margin-left: 9px;
        margin-top: 8px;
        margin-bottom: 0px;

        > input,
        > button {
            font-size: 1.6em;
            margin: 0 -9px;
            margin-top: -4px;
            background-color: transparent;
            padding-left: 0px;
            text-align: left;
            justify-content: flex-start;
        }
        .empty {
            color: #98a4b3;
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
    border-radius: 20px;
    position: absolute;
    right: 0;
    top: 0;
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
        <Container>
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
                        {idx > 0 && (
                            <span className="breadcrumb-arrow" aria-hidden="true">
                                {' '}
                                ›{' '}
                            </span>
                        )}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={url}
                            itemType="https://schema.org/Thing"
                            itemProp="item"
                            className={idx === items.length - 1 ? 'current' : ''}
                        >
                            <span itemProp="name">{label}</span>
                        </a>
                        <meta itemProp="position" content={idx + 1} />
                    </li>
                ))}
            </BreadCrumbsList>
        </Container>
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
