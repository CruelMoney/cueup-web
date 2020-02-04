import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTransition, animated, config } from 'react-spring';
import { HeaderTitle, Body } from 'components/Text';
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
    @media only screen and (max-width: 685px) {
        flex-direction: column;
        align-items: center;
    }
`;

const TextCol = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 0 0 5%;
    @media only screen and (max-width: 685px) {
        padding: 0;
    }
`;

const GigCard = styled.div`
    border-radius: 6px;
    width: 300px;
    height: 170px;
    background: #fff;
    padding: 1.5em;
    box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3),
        0 -12px 36px -8px rgba(0, 0, 0, 0.025);
`;

const cards = [{ id: 1 }, { id: 2 }, { id: 3 }];

const AnimatedCards = () => {
    const [index, set] = useState(0);
    const transitions = useTransition(cards, (item) => item.id, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.molasses,
    });

    useEffect(() => setInterval(() => set((state) => (state + 1) % 4), 2000), []);

    return transitions.map(({ item, props, key }) => (
        <animated.li key={key} style={{ ...props }}>
            <GigCard />
        </animated.li>
    ));
};

const GettingGigs = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <GettingGigsWrapper>
                    <ul>
                        <AnimatedCards />
                    </ul>
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
            </Container>
        </Bg>
    );
};

export default addTranslate(GettingGigs);
