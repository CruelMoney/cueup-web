import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import { ResponsiveTextAccent } from '../components/blocks/TextAccent';
import { BlueTitle } from '../components/blocks/Title';
import { GrayText } from '../components/blocks/Text';
import ReadMore from '../components/blocks/ReadMore';
import gigRequest from '../../../assets/images/gig_request.png';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';

const Bg = styled.div`
    padding-top: 50px;
    background-color: white;
    width: 100vw;
    order: 5;
`;

const GettingGigsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    padding-bottom: 50px;
    @media only screen and (max-width: 685px) {
        flex-direction: column;
        align-items: center;
    }
`;

const TextCol = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 0 0 150px;
    @media only screen and (max-width: 685px) {
        padding: 0;
    }
`;

const GettingGigs = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <GettingGigsWrapper>
                    <GracefullImage
                        src={gigRequest}
                        animate
                        alt="Gig request"
                        style={{ width: '40%', alignSelf: 'center' }}
                    />
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
