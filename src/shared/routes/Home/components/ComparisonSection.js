import React from 'react';
import styled from 'styled-components';
import { InlineIcon } from '@iconify/react';
import checkmarkCircle from '@iconify/icons-ion/checkmark-circle';
import { Container, Col, Row, RowWrap } from 'components/Blocks';
import { H2, TextAccent, Body } from 'components/Text';
import GracefullImage from 'components/GracefullImage';
import comparisonImage from '../assets/the_lawn.jpg';

const data = [
    { label: 'Price', traditional: 'Price bloated by agency', cueup: 'Actual prices' },
    {
        label: 'Payment',
        traditional: 'Cash or wire transfer only',
        cueup: 'Card or any method of your choice',
    },
    { label: 'Cancelation', traditional: 'No refund policy', cueup: 'Refund guarantee' },
    { label: 'Backup DJ', traditional: 'No backup', cueup: 'Backup DJs on standby' },
    {
        label: 'Communication',
        traditional: 'Through agency',
        cueup: 'Contact directly with DJ',
    },
    { label: 'Selection', traditional: 'One choice', cueup: 'Pick from many fantastic DJs' },
    {
        label: 'Preview DJ skills',
        traditional: 'No preview',
        cueup: 'Listen, watch, and decide',
    },
    {
        label: 'Musical style',
        traditional: 'Take the music as is',
        cueup: 'Choose your musical style',
    },
    { label: 'Reviews', traditional: 'No reviews', cueup: 'Reviews and testimonials' },
];

const ComparisonSection = () => {
    return (
        <Wrapper>
            <Container>
                <Col style={{ maxWidth: 500 }}>
                    <TextAccent>Simplified process</TextAccent>
                    <H2>Avoid the usual pains of finding a good DJ</H2>
                </Col>
                <RowWrap>
                    <Body>
                        Find your next DJ in a simpler, cheaper, and more secure way. Cueup
                        simplifies every aspect of booking a DJ compared to the traditional booking
                        process.
                    </Body>
                    <ComparisonTable>
                        <table cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th /> <th>Traditional</th> <th>Cueup</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(({ label, traditional, cueup }, idx) => (
                                    <tr key={idx}>
                                        <th>{label}</th>
                                        <td>
                                            <span>{traditional}</span>
                                        </td>
                                        <td>
                                            <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                            <span style={{ color: '#00D1FF', fontWeight: 500 }}>
                                                {cueup}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ComparisonTable>
                </RowWrap>
                <CustomImage src={comparisonImage} />
            </Container>
        </Wrapper>
    );
};

const ComparisonTable = styled.div`
    flex: 1;
    word-break: break-word;
    font-size: 16px;
    margin: 0.625em;
    margin-top: -2em;
    z-index: 2;
    table {
        width: 100%;
        border-collapse: separate;
        position: relative;
    }
    table::before {
        content: '';
        position: absolute;
        top: 1.75em;
        right: -0.625em;
        bottom: -0.625em;
        left: -0.625em;
        border-radius: 1.25em;
        padding: 0.625em;
        background-color: #122b48;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
    }
    thead {
        th,
        td {
            padding-bottom: 1em;
        }
    }
    tbody {
        position: relative;
        color: #fff;
        tr:nth-of-type(2n + 1) {
            th,
            td {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
    }
    tr {
        position: relative;
        height: 2.625em;
        padding: 0.5em 0;
        span {
            display: inline-block;
            margin: 0.4em 0;
        }
    }
    td,
    th {
        padding-left: 0.625em;
        margin: 0;
        font-weight: 100;
        position: relative;

        svg {
            font-size: 1.3em;
            position: absolute;
            left: 0.375em;
            top: 50%;
            transform: translateY(-50%) !important;
        }
    }
    td:last-of-type {
        padding-left: 2.2em;
    }
    th {
        font-weight: 500;
    }

    th {
        border-top-left-radius: 0.625em;
        border-bottom-left-radius: 0.625em;
    }
    td:last-of-type {
        border-top-right-radius: 0.625em;
        border-bottom-right-radius: 0.625em;
    }
    td:before {
        content: '';
        display: block;
        position: absolute;
        top: 20%;
        left: 0;
        width: 2px;
        height: 60%;
        background-color: rgba(255, 255, 255, 0.15);
    }

    @media screen and (max-width: 768px) {
        width: calc(100% - 15px);
        min-width: calc(100% - 15px);
        margin-top: 3em;
        font-size: 12px;
    }
`;

const Wrapper = styled.section`
    display: flex;
    text-align: left;
    padding: 60px 0;
    ${Body} {
        max-width: 220px;
        margin-right: 50px;
    }
    @media screen and (max-width: 768px) {
        ${Body} {
            max-width: 100%;
            margin-right: 0;
        }
    }
`;

const CustomImage = styled(GracefullImage)`
    filter: drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.15));
    border-radius: 20px;
    width: 480px;
    height: 230px;
    object-fit: cover;
    margin-top: -70px;
    z-index: -1;

    @media screen and (max-width: 768px) {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        margin-top: -24px;
        max-width: calc(100% - 15px);
    }
`;

export default ComparisonSection;
