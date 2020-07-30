import React from 'react';
import styled from 'styled-components';
import { InlineIcon } from '@iconify/react';
import checkmarkCircle from '@iconify/icons-ion/checkmark-circle';
import { Container, Col, Row } from 'components/Blocks';
import { H2, TextAccent, Body } from 'components/Text';
const ComparisonSection = () => {
    return (
        <Wrapper>
            <Container>
                <Col>
                    <TextAccent>Simplified process</TextAccent>
                    <H2>
                        Avoid the usual pains
                        <br />
                        of finding a good DJ
                    </H2>
                </Col>
                <Row>
                    <Body style={{ maxWidth: 220, marginRight: 60 }}>
                        Cueup is the easiest way for you to get a great DJ for your event. Tell us
                        about your event below, and check out 1000s of qualified DJs.
                    </Body>
                    <ComparisonTable>
                        <table>
                            <thead>
                                <th /> <td>Traditional</td> <td>Cueup</td>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Finding DJs</th>
                                    <td>Manual</td>
                                    <td>
                                        <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                        Automatic
                                    </td>
                                </tr>
                                <tr>
                                    <th>Finding DJs</th>
                                    <td>Manual</td>
                                    <td>
                                        <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                        Automatic
                                    </td>
                                </tr>
                                <tr>
                                    <th>Finding DJs</th>
                                    <td>Manual</td>
                                    <td>
                                        <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                        Automatic
                                    </td>
                                </tr>
                                <tr>
                                    <th>Finding DJs</th>
                                    <td>Manual</td>
                                    <td>
                                        <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                        Automatic
                                    </td>
                                </tr>
                                <tr>
                                    <th>Finding DJs</th>
                                    <td>Manual</td>
                                    <td>
                                        <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                        Automatic
                                    </td>
                                </tr>
                                <tr>
                                    <th>Finding DJs</th>
                                    <td>Manual</td>
                                    <td>
                                        <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                        Automatic
                                    </td>
                                </tr>
                                <tr>
                                    <th>Finding DJs</th>
                                    <td>Manual</td>
                                    <td>
                                        <InlineIcon icon={checkmarkCircle} color="#00D1FF" />
                                        Automatic
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </ComparisonTable>
                </Row>
            </Container>
        </Wrapper>
    );
};

const ComparisonTable = styled.div`
    width: 100%;
    word-break: break-word;
    margin: 10px;
    margin-top: -25px;
    table {
        width: 100%;
        border-collapse: separate;
    }
    thead {
        th,
        td {
            padding-bottom: 10px;
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
    }
    tr {
        height: 40px;
        position: relative;
    }
    td,
    th {
        padding-left: 10px;
        margin: 0;
        svg {
            margin-right: 6px;
        }
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
`;

const Wrapper = styled.section`
    display: flex;
    text-align: left;
    padding: 60px 0;
`;

export default ComparisonSection;
