import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTransition, animated, config } from 'react-spring';
import { HeaderTitle, Body, BodySmall, BodyBold } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import GracefullVideo from 'components/GracefullVideo';
import { ResponsiveTextAccent } from '../components/blocks/TextAccent';
import { BlueTitle } from '../components/blocks/Title';
import { GrayText } from '../components/blocks/Text';
import ReadMore from '../components/blocks/ReadMore';
import gigRequest from '../../../assets/images/gig_request.png';
import NY from '../../../assets/images/gigs/NY.png';
import LA from '../../../assets/images/gigs/LA.png';
import Bali from '../../../assets/images/gigs/Bali.png';
import addTranslate from '../../../components/higher-order/addTranslate';
import GracefullImage from '../../../components/GracefullImage';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    padding: 250px 0;
    width: 100%;
    order: 5;
`;

const GettingGigsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    @media only screen and (max-width: 685px) {
        flex-direction: column;
        align-items: center;
    }
`;

const TextCol = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 90px;
    @media only screen and (max-width: 685px) {
        padding: 0;
    }
`;

const CardsWrapper = styled.ul`
    position: relative;
    width: 50%;
    perspective: 350px;
    perspective-origin: center;
    width: 350px;
    top: 80px;
    right: 90px;
    height: 250px;
`;

const GigCard = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 6px;
    width: 350px;
    height: 190px;
    background: #fff;
    padding: 1.5em;
    box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3),
        0 -12px 36px -8px rgba(0, 0, 0, 0.025);
`;

const GigRequestBubble = styled.div`
    position: absolute;
    height: 30px;
    width: 164px;
    border-radius: 16px;
    background: #00d1ff;
    right: 70px;
    top: 18px;
    z-index: 5;
    > p {
        text-align: center;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 30px;
    }
`;

const gigCards = [
    { id: 1, name: 'Copenhagen' },
    { id: 2, name: 'Los Angeles' },
    { id: 3, name: 'Bali' },
    { id: 4, name: 'Nyc' },
];

const AnimatedCards = () => {
    const [cards, set] = useState(gigCards);

    const Offset = 32;
    const transitions = useTransition(
        cards.map((data, idx) => ({
            ...data,
            y: idx * Offset,
            opacity: idx === cards.length - 1 ? -1 : 1,
        })),
        (item) => item.id,
        {
            native: true,
            from: { opacity: 0 },
            leave: { opacity: 0 },
            enter: ({ y }) => ({ y, opacity: 1 }),
            update: ({ y, opacity }) => ({ y, opacity }),
            config: config.molasses,
        }
    );

    useEffect(() => setInterval(() => set((cc) => [cc.pop(), ...cc]), 4000), []);

    return (
        <div style={{ position: 'relative' }}>
            <GigRequestBubble>
                <p>NEW GIG REQUEST</p>
            </GigRequestBubble>

            <CardsWrapper>
                {transitions.map(({ item, props: { y, ...rest }, key }) => (
                    <animated.li
                        key={key}
                        style={{
                            ...rest,
                            transform: y.interpolate(
                                (y) => `translate3d(0,${(-1 * y) / 2}px,${y}px)`
                            ),
                        }}
                    >
                        <GigCard>
                            <h4>{item.name}</h4>
                        </GigCard>
                    </animated.li>
                ))}
            </CardsWrapper>
        </div>
    );
};

const GettingGigs = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <GettingGigsWrapper>
                    <AnimatedCards />
                    <TextCol>
                        <ResponsiveTextAccent margin="0 0 15px 0">
                            {translate('become-dj.getting-gigs.get-gigs-feature.feature')}
                        </ResponsiveTextAccent>
                        <BlueTitle left size="64px" line="64px" spacing="-1.33px">
                            {translate('become-dj.getting-gigs.get-gigs-feature.get-gigs')}
                        </BlueTitle>
                        <GrayText>
                            {translate(
                                'become-dj.getting-gigs.get-gigs-feature.chat-the-organizer'
                            )}{' '}
                            <br />
                            {translate(
                                'become-dj.getting-gigs.get-gigs-feature.make-your-offer'
                            )}{' '}
                            <br />
                            {translate(
                                'become-dj.getting-gigs.get-gigs-feature.play-get-paid'
                            )}{' '}
                            <br />
                        </GrayText>
                        <ReadMore />
                    </TextCol>
                </GettingGigsWrapper>
                <BodySmall style={{ textAlign: 'center', marginTop: '60px' }}>
                    Amount of available gigs vary depending on your area.
                </BodySmall>
            </Container>
        </Bg>
    );
};

export default addTranslate(GettingGigs);
