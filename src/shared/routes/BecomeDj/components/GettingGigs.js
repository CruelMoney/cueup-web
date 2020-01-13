import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import { TextAccent } from '../components/blocks/TextAccent';
import { Title } from '../components/blocks/Title';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import gigRequest from '../../../assets/images/gig_request.png';
import arrow from '../../../assets/images/arrow_right.png';

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
    }
`;

const TextCol = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 0 0 150px;
`;

const BlueTitle = styled(Title)`
    font-family: AvenirNext-Bold;
    font-size: 64px;
    color: #122b48;
`;

const GrayText = styled.p`
    margin-top: 50px;
    font-family: AvenirNext-Regular;
    font-size: 20px;
    color: #4d6480;
    line-height: 34px;
`;

const ReadMoreText = styled.p`
    margin-top: 50px;
    font-family: AvenirNext-DemiBold;
    font-size: 20px;
    color: #122b48;
    align-self: flex-end;
`;

const ReadMoreWrapper = styled.div`
    display: flex;
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
                        <TextAccent margin="0 0 15px 0">
                            {translate('become-dj.getting-gigs.get-gigs-feature.feature')}
                        </TextAccent>
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
                        <ReadMoreWrapper>
                            <ReadMoreText>
                                {translate('become-dj.getting-gigs.get-gigs-feature.read-more')}{' '}
                                <br />
                            </ReadMoreText>
                            <GracefullImage
                                src={arrow}
                                animate
                                alt="right arrow"
                                style={{
                                    marginLeft: '20px',
                                    maxWidth: '20px',
                                    alignSelf: 'flex-end',
                                    paddingBottom: '10px',
                                }}
                            />
                        </ReadMoreWrapper>
                    </TextCol>
                </GettingGigsWrapper>
            </Container>
        </Bg>
    );
};

export default addTranslate(GettingGigs, content);
