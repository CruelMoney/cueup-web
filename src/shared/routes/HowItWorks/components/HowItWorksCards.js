import React, { Component } from 'react';
import styled from 'styled-components';
// import { findByLabelText } from '@testing-library/react';
import { Title } from '../../../components/common/Title';
import { Body } from '../../../components/Text';

const CardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 100vw;
`;
const HowItWorksCardBox = styled.div`
    width: 278px;
    height: 242px;
    border-radius: 28px;
    background: #183659;
    margin: 20px;
`;
const HowItWorksCardHeader = styled.div`
    display: flex;
    height: 78px;
`;
const HowItWorksCardTitle = styled.div`
    width: 208px;
    height: 90px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    margin-top: 0.3em;
`;
const HowItWorksCardNumberBox = styled.div`
    width: 75px;
    height: 90px;
    background: #1c3f69;
    border-radius: 28px 0 28px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 14px;
    /* box-shadow: 1px 0px 5px #294566; */
    /* margin: -28px 0 0 -28px; */
`;
const HowItWorksCardDescription = styled.div`
    padding: 30px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const HowItWorksCard = (props) => {
    return (
        <HowItWorksCardBox>
            <HowItWorksCardHeader>
                <HowItWorksCardNumberBox>
                    <Title size="33px">{props.number}</Title>
                </HowItWorksCardNumberBox>
                <HowItWorksCardTitle>
                    <Title left size="24px" line="24px">
                        {props.title}
                    </Title>
                </HowItWorksCardTitle>
            </HowItWorksCardHeader>
            <HowItWorksCardDescription>
                <Body white>{props.description}</Body>
            </HowItWorksCardDescription>
        </HowItWorksCardBox>
    );
};

const HowItWorksCards = () => {
    const cardsData = [
        {
            number: '01',
            title: 'Tell us about your event.',
            description:
                'Certe, inquam, pertinax non fuisse torquem detraxit hosti et quidem.  detraxit hosti et quidem.',
        },
        {
            number: '02',
            title: 'Message the DJs.',
            description:
                'Certe, inquam, pertinax non fuisse torquem detraxit hosti et quidem.  detraxit hosti et quidem.',
        },
        {
            number: '03',
            title: 'Confirm booking.',
            description:
                'Certe, inquam, pertinax non fuisse torquem detraxit hosti et quidem.  detraxit hosti et quidem.',
        },
    ];
    const cards = cardsData.map((card) => (
        <HowItWorksCard
            key={card.number}
            number={card.number}
            title={card.title}
            description={card.description}
        />
    ));
    return <CardWrapper>{cards}</CardWrapper>;
};

export default HowItWorksCards;
