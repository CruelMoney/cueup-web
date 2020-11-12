import React from 'react';

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Container, RowWrap, ReadMore, RowMobileCol } from 'components/Blocks';
import { H3, Body } from 'components/Text';
import { ReactComponent as MusicNote } from '../assets/note.svg';
import { ReactComponent as Padlock } from '../assets/padlock.svg';

const FeatureCards = () => {
    return (
        <Container>
            <RowMobileCol style={{ margin: '0 -15px' }}>
                <Card shadow>
                    <H3>
                        <Padlock />
                        Secure and easy
                    </H3>
                    <Body>
                        You can complete the booking using your preferred payment method, like cash
                        or card, and when we act as the facilitator, you can be sure that your money
                        is safe until the event is finished. Probably the easiest way to book a DJ
                        anywhere.
                    </Body>
                </Card>
                <Card shadow>
                    <H3>
                        <MusicNote />
                        Music on your terms
                    </H3>
                    <Body>
                        Every DJ has been screened by us or even reviewed at previous events. You
                        can also listen to mixes, see photos and videos from their other
                        performances. With Cueup, you will always find a DJ that suits your event.
                    </Body>
                </Card>
            </RowMobileCol>
        </Container>
    );
};

const Card = styled.div`
    flex: 1;
    background: #ffffff;
    max-width: 100%;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.06), 0 13px 13px 0 rgba(0, 0, 0, 0.08),
        0 20px 15px 0 rgba(0, 0, 0, 0.04);
    border-radius: 28px;
    padding: 39px;
    min-width: 300px;
    margin: 0 15px;
    margin-bottom: 30px;
    ${H3} {
        margin-bottom: 0.5em;
        color: #00d1ff;
        svg {
            display: block;
            margin-bottom: 0.25em;
            height: max(36px, 1em);
            width: auto;
        }
    }
    a {
        margin-top: 15px;
        display: block;
    }

    @media only screen and (max-width: 768px) {
        padding: 30px;
        margin-bottom: 15px;
    }
    @media only screen and (max-width: 425px) {
        padding: 24px;
    }
`;

export default FeatureCards;
