import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import checkmarkCircle from '@iconify/icons-ion/checkmark-circle';
import { InlineIcon } from '@iconify/react';
import { Col, Container, Hide, ReadMore, Row, RowMobileCol, Show } from 'components/Blocks';

import { ComparisonTable } from 'components/common/ComparissonTable';
import { Card } from './PaymentCards';
import { GrayText, Header } from './Text';
import { TextAccent } from './blocks/TextAccent';

const Pricing = () => {
    return (
        <Bg>
            <Container>
                <Card>
                    <TextAccent>PICK YOUR LEVEL</TextAccent>
                    <Header small>Pricing</Header>
                    <RowMobileCol>
                        <Col>
                            <GrayText>
                                Choose between 2 memberships.
                                <br /> You can always change membership.
                                <br />
                            </GrayText>

                            <Hide maxWidth="400px">
                                <a
                                    href={'https://cueup.io/blog/introducing-cueup-pro-for-djs'}
                                    style={{ marginTop: '42px' }}
                                >
                                    <ReadMore size="18px" uppercase={false}>
                                        Read more about Pro
                                    </ReadMore>
                                </a>
                            </Hide>
                        </Col>

                        <CustomTable>
                            <table cellSpacing={0}>
                                <thead>
                                    <tr>
                                        <th /> <th>Free</th> <th>Pro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>Playing locations</th>
                                        <td>
                                            <span>1 country</span>
                                        </td>
                                        <td>
                                            <span>Unlimited locations</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Contact to organizers</th>
                                        <td>
                                            <span>Contact using chat</span>
                                        </td>
                                        <td>
                                            <span>Contact on chat, phone, or email</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Sound uploads</th>
                                        <td>
                                            <span>3 uploads</span>
                                        </td>
                                        <td>
                                            <span>Unlimited uploads</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Integrations</th>
                                        <td>
                                            <span>SoundCloud, Mixcloud, Instagram</span>
                                        </td>
                                        <td>
                                            <span>SoundCloud, Mixcloud, Instagram</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>DJ search</th>
                                        <td>
                                            <span>Showed in search results</span>
                                        </td>
                                        <td>
                                            <span>Prioritized in search results</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Commission on gigs</th>
                                        <td>
                                            <span>~7.5%</span>
                                        </td>
                                        <td>
                                            <span>0%</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Price</th>
                                        <td>
                                            <b>
                                                <span>$0</span>
                                            </b>
                                        </td>
                                        <td>
                                            <b>
                                                <span>$29 / month</span>
                                            </b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CustomTable>
                    </RowMobileCol>
                </Card>
            </Container>
        </Bg>
    );
};

const CustomTable = styled(ComparisonTable)`
    margin-bottom: 45px;
    table:before {
        box-shadow: none;
        background-color: rgb(233, 236, 240);
    }
    tbody {
        color: #4d6480;
        tr:nth-of-type(2n + 1) th,
        tr:nth-of-type(2n + 1) td {
            background-color: #f7f9fc;
        }
        td::before {
            background-color: #4d6480;
            opacity: 0.15;
        }
        td:last-of-type {
            padding-left: 0.625em;
        }
    }
    thead {
        th {
            font-size: 20px;
            padding-bottom: 0px;
            bottom: 10px;
            font-weight: 700;
        }
    }
    @media only screen and (max-width: 400px) {
        min-width: calc(100% + 30px);
        margin-left: -9px;
        margin-right: -30px;
        margin-bottom: 15px;
        margin-top: 0;
    }
`;

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    z-index: 2;
    position: relative;
    p,
    h2 {
        text-align: left;
        margin-bottom: 24px;
    }
    ${Col} {
        min-width: 300px;
        max-width: 300px;
        margin-bottom: 30px;
        padding-right: 30px;
    }
    @media only screen and (max-width: 768px) {
        ${Col} {
            max-width: 100%;
        }
    }
`;

export default Pricing;
