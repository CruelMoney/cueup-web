import React from 'react';
import styled from 'styled-components';
import Popup from 'components/common/Popup';
import { Body, H2 } from 'components/Text';
import { Col, PrimaryButton } from 'components/Blocks';

const Wrapper = styled.div`
    padding: 1em;
    @media only screen and (max-width: 480px) {
        padding-bottom: 75px;
    }
`;

const GigsInformationPopup = ({ onConfirm }) => {
    return (
        <Popup showing hideClose width={600}>
            <Wrapper>
                <H2
                    small
                    style={{ marginTop: '20px', marginBottom: '1em', fontWeight: 700, flex: 1 }}
                >
                    Two ways of getting gigs
                </H2>
                <Body>
                    <b>1. Direct requests</b>
                    <br />
                    These are people that have requested you to make an offer, and it’s your best
                    chance of getting a gig.
                </Body>
                <br />
                <Body>
                    <b>2. Gig opportunities</b> <br />
                    These are people that have requested another DJ, but haven’t completed the
                    booking. It is your “opportunity” to reach out and get a gig.
                </Body>
                <br />
                <Body>
                    <b>Pro members vs. Free members</b> <br />
                    For both types you can message in the chat and make your offer on the free plan.
                    If you are a Pro member you can also call or email the organiser directly.
                </Body>
                <br />
                <a
                    href="https://cueup.zendesk.com/hc/en-us/articles/360017721339"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Body style={{ textDecoration: 'underline' }}>Read more about gigs</Body>
                </a>
                <Col>
                    <PrimaryButton
                        onClick={onConfirm}
                        style={{ maxWidth: '100%', marginTop: '42px' }}
                    >
                        Ok, let's go!
                    </PrimaryButton>
                </Col>
            </Wrapper>
        </Popup>
    );
};

export default GigsInformationPopup;
