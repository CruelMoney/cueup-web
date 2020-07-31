import React from 'react';
import styled from 'styled-components';
import { InlineIcon } from '@iconify/react';
import checkmarkCircle from '@iconify/icons-ion/checkmark-circle';
import { Container, Col, Row, RowWrap } from 'components/Blocks';
import { H2, TextAccent, Body } from 'components/Text';
import GracefullImage from 'components/GracefullImage';
import comparisonImage from '../assets/the_lawn.jpg';

const data = [
    { label: 'Finding DJs', traditional: 'Manual', cueup: 'Automatic' },
    { label: 'Finding DJs', traditional: 'Manual', cueup: 'Automatic' },
    { label: 'Finding DJs', traditional: 'Manual', cueup: 'Automatic' },
    { label: 'Finding DJs', traditional: 'Manual', cueup: 'Automatic' },
    { label: 'Finding DJs', traditional: 'Manual', cueup: 'Automatic' },
    { label: 'Finding DJs', traditional: 'Manual', cueup: 'Automatic' },
    { label: 'Finding DJs', traditional: 'Manual', cueup: 'Automatic' },
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
                        Cueup is the easiest way for you to get a great DJ for your event. Tell us
                        about your event below, and check out 1000s of qualified DJs.
                    </Body>
                    <ComparisonTable>
                        <table cellSpacing={0}>
                            <thead>
                                <th /> <th>Traditional Booking</th> <th>Cueup</th>
                            </thead>
                            <tbody>
                                {data.map(({ label, traditional, cueup }, idx) => (
                                    <tr key={idx}>
                                        <th>{label}</th>
                                        <td>{traditional}</td>
                                        <td>
                                            <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                            {cueup}
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
    margin: 10px;
    margin-top: -30px;
    table {
        width: 100%;
        border-collapse: separate;
    }
    thead {
        th,
        td {
            padding-bottom: 15px;
        }
    }
    tbody {
        position: relative;
        color: #fff;
    }
    tbody::before {
        content: '';
        position: absolute;
        top: -10px;
        right: -10px;
        bottom: -10px;
        left: -10px;
        border-radius: 20px;
        padding: 10px;
        background-color: #122b48;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
    }
    tr {
        height: 42px;
        position: relative;
    }
    td,
    th {
        padding-left: 10px;
        margin: 0;
        font-weight: 100;
        position: relative;
        svg {
            margin-right: 6px;
            font-size: 1.3em;
            top: 2px;
            position: relative;
        }
    }
    th {
        font-weight: 500;
    }
    tr:nth-of-type(2n + 1) {
        th,
        td {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }

    th {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    td:last-of-type {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
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
`;

const Wrapper = styled.section`
    display: flex;
    text-align: left;
    padding: 60px 0;
    ${Body} {
        max-width: 220px;
        margin-right: 50px;
    }
    @media screen and (max-width: 480px) {
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
`;

export default ComparisonSection;
