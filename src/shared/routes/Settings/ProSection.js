import React, { useState } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import Icon from '@iconify/react';
import starIcon from '@iconify/icons-ion/star';
import { PrimaryButton, Col, RowWrap } from 'components/Blocks';

import { BodySmall } from 'components/Text';

const ProSection = () => {
    const match = useRouteMatch();

    return (
        <CardLink to={match.url + '/get-pro'}>
            <h2>
                Cueup Pro
                <span
                    title="Cueup Pro DJ"
                    style={{
                        backgroundColor: '#31daff',
                        borderRadius: 10,
                        height: 16,
                        width: 16,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        marginLeft: 6,
                        top: -16,
                    }}
                >
                    <Icon color={'#fff'} width={10} height={10} icon={starIcon} />
                </span>
            </h2>
            <RowWrap>
                <Col style={{ flex: 2 }}>
                    <BodySmall
                        white
                        medium
                        style={{
                            marginBottom: 24,
                            columnCount: 2,
                            fontWeight: 500,
                            color: '#fff',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        ✔ Direct contact to organizers
                        <br />✔ Top position in search results
                        <br />✔ No service fees
                        <br />✔ Unlimited playing locations
                        <br />✔ Add website link to profile
                        <br />✔ Unlimited sound uploads
                        <br />✔ Pro Badge
                        <br />✔ And much more...
                    </BodySmall>
                </Col>
                <Col style={{ flex: 1, minWidth: '200px' }}>
                    <PrimaryButton fullWidth data-cy="go-pro-button">
                        Go Pro
                    </PrimaryButton>

                    <BodySmall
                        style={{
                            margin: 'auto',
                            marginTop: 5,
                            textAlign: 'center',
                            color: '#fff',
                            opacity: 0.6,
                            maxWidth: 200,
                        }}
                    >
                        Automatic refund if you don't receive any gig requests.
                    </BodySmall>
                </Col>
            </RowWrap>
        </CardLink>
    );
};

const CardLink = styled(NavLink)`
    border-radius: 12px;
    background: radial-gradient(50% 50% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    box-shadow: 4px 5px 20px rgba(0, 0, 0, 0.09);
    padding: 2em;
    padding-bottom: 1em;
    margin-bottom: 42px;
    color: #fff;
    width: 100%;
    overflow: hidden;
    > h2 {
        font-size: 36px;
        margin-bottom: 0.5em;
        color: #fff;
    }
    ${Col} {
        > p {
            width: 100%;
            margin-bottom: 0;
        }
    }
    @media screen and (max-width: 480px) {
        text-align: center;
        ${BodySmall} {
            column-count: 1 !important;
        }
    }
`;

export default ProSection;
