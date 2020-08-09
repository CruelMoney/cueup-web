import React from 'react';
import styled from 'styled-components';
import { Body } from '../../../components/Text';

const CardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 100vw;
`;
const HowItWorksCardBox = styled.div`
    width: 280px;
    height: 242px;
    border-radius: 28px;
    background: #183659;
    margin: 15px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
    @media screen and (max-width: 480px) {
        margin: 6px;
        height: auto;
    }
`;
const HowItWorksCardHeader = styled.div`
    display: flex;
    height: 78px;
`;
const HowItWorksCardTitle = styled.div`
    width: 200px;
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
    /* box-shadow: 1px 0px 5px #294566; */
    /* margin: -28px 0 0 -28px; */
`;
const HowItWorksCardDescription = styled.div`
    padding: 30px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const CardHeader = styled.h3`
    font-size: 24px;
    color: #fff;
`;

const CardHeaderNumber = styled.h3`
    font-size: 33px;
    color: #fff;
`;

const HowItWorksCard = (props) => {
    return (
        <HowItWorksCardBox>
            <HowItWorksCardHeader>
                <HowItWorksCardNumberBox>
                    <CardHeaderNumber>{props.number}</CardHeaderNumber>
                </HowItWorksCardNumberBox>
                <HowItWorksCardTitle>
                    <CardHeader>{props.title}</CardHeader>
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
            title: 'Tell us about your event',
            description:
                'Describe how you want your event to take place and your ideal DJ performance.',
        },
        {
            number: '02',
            title: 'Choose a DJ',
            description:
                "We'll match you with the most qualified DJs. Message them to agree on the details and get a good price.",
        },
        {
            number: '03',
            title: 'Enjoy the music',
            description:
                "Once you've found your perfect DJ, you can safely pay on Cueup, or use any form of payment you’d like.",
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
