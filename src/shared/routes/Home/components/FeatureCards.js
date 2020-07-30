import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Header } from 'routes/BecomeDj/components/Text';
import { TextAccent } from 'routes/BecomeDj/components/blocks/TextAccent';

import { SubTitle } from 'routes/BecomeDj/components/SubTitle';
import PaymentCards from 'routes/BecomeDj/components/PaymentCards';
import { Container, Col, ReadMore } from 'components/Blocks';

const FeatureCards = () => {
    return (
        <Container>
            <PaymentCards
                accent="PAYMENT METHODS"
                header1={'Credit or Debit Card'}
                description1={
                    "The easiest way to pay the DJ is using your card. We'll take care of the rest and refund all the money in case the DJ cancels."
                }
                header2={'Invoice or Cash'}
                description2={
                    'You can also pay the DJ directly using any other payment method that the DJ is providing. For example ask for an invoice or just pay in cash.'
                }
            />
        </Container>
    );
};

export default FeatureCards;
