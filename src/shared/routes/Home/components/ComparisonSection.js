import React from 'react';
import styled from 'styled-components';
import { InlineIcon } from '@iconify/react';
import checkmarkCircle from '@iconify/icons-ion/checkmark-circle';
import { Container, Col, Row, RowWrap } from 'components/Blocks';
import { H2, TextAccent, Body } from 'components/Text';
import GracefullImage from 'components/GracefullImage';
import { ComparisonTable } from 'components/common/ComparissonTable';
import comparisonImage from '../assets/the_lawn.jpg';

const data = [
    { label: 'Price', traditional: 'Price bloated by agency', cueup: "DJs' own price" },
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
    { label: 'Selection', traditional: 'One choice', cueup: 'Pick from many DJs' },
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
