import React from 'react';
import styled from 'styled-components';
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
import content from '../content.json';
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

const StyledImage = styled(GracefullImage)`
    width: 60%;
    padding: 0 0 0 10%;
    align-self: center;
    @media only screen and (max-width: 685px) {
        width: 85%;
        padding: 0px;
    }
`;

const AnimatedCardWrapper = styled.div`
    width: 60%;
    padding: 0 0 0 10%;
    align-self: center;
    @media only screen and (max-width: 685px) {
        width: 85%;
        padding: 0px;
    }
`;

const AnimatedCard = styled(GracefullImage)`
    width: 100%;
    /* animation-name: stack;
    animation-duration: 4s; */
    /* animation-fill-mode: forwards; */
    animation: 4s infinite stack;

    @keyframes stack {
        0% {
            transform: scale(0.7);
        }
        25% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.9);
        }
        75% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.1);
        }
    }
`;

const GettingGigs = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <GettingGigsWrapper>
                    <StyledImage src={gigRequest} animate alt="Gig request" />
                    {/* <AnimatedCardWrapper>
                        <AnimatedCard src={LA}/>
                    </AnimatedCardWrapper> */}
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

export default addTranslate(GettingGigs, content);
