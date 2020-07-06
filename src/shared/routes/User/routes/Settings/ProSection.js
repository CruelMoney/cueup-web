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
        <NavLink to={match.url + '/get-pro'}>
            <Card>
                <h2>
                    Cueup Pro
                    <span
                        title="Cueup Pro DJ"
                        style={{
                            backgroundColor: '#31daff',
                            borderRadius: 10,
                            height: 20,
                            width: 20,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            marginLeft: 9,
                            top: -12,
                        }}
                    >
                        <Icon color={'#fff'} width={14} height={14} icon={starIcon} />
                    </span>
                </h2>
                <RowWrap>
                    <Col style={{ flex: 2 }}>
                        <BodySmall
                            white
                            medium
                            style={{
                                marginBottom: 12,
                                columnCount: 2,
                                fontWeight: 500,
                                color: '#fff',
                            }}
                        >
                            ✔ No service fees
                            <br />✔ Priority on new events
                            <br />✔ Unlimited playing locations
                            <br />✔ Direct contact to organizers
                            <br />✔ Unlimited sound uploads
                            <br />✔ Add website link to profile
                            <br />✔ Unlimited sound uploads
                            <br />✔ And so much more...
                        </BodySmall>
                    </Col>
                    <Col style={{ flex: 1 }}>
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
            </Card>
        </NavLink>
    );
};

const Card = styled.section`
    border-radius: 12px;
    background: radial-gradient(50% 50% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    box-shadow: 4px 5px 20px rgba(0, 0, 0, 0.09);
    padding: 2em;
    margin-bottom: 42px;
    color: #fff;
    width: 100%;
    > h2 {
        font-size: 36px;
        margin-bottom: 0.5em;
    }
    ${Col} {
        > p {
            width: 100%;
            margin-bottom: 0;
        }
    }
`;

export default ProSection;
