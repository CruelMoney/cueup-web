import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import { ResponsiveTextAccent } from '../components/blocks/TextAccent';
import { BlueTitle } from '../components/blocks/Title';
import { GrayText } from '../components/blocks/Text';
import ReadMore from '../components/blocks/ReadMore';
import paymentCard from '../../../assets/images/Credit card.png';
import invoice from '../../../assets/images/Invoice.png';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    order: 6;
    background-image: linear-gradient(to bottom, white 0% 80%, #0b1b2d 80%);
    @media only screen and (max-width: 685px) {
        background-image: linear-gradient(to bottom, white 0% 90%, #0b1b2d 90%);
    }
`;

const CardsContainer = styled.div`
    display: flex;
    justify-content: center;
    @media only screen and (max-width: 685px) {
        flex-direction: column;
    }
`;

const Card = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.06), 0 13px 13px 0 rgba(0, 0, 0, 0.08),
        0 20px 15px 0 rgba(0, 0, 0, 0.04);
    border-radius: 28px;
    padding: 50px 15px 0 15px;
    margin: 15px;
`;

const Payments = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <CardsContainer>
                    <Card>
                        <ResponsiveTextAccent margin="0 0 15px 0">
                            {translate('become-dj.payments.card-payments.receive-payments')}
                        </ResponsiveTextAccent>
                        <BlueTitle left>
                            {translate('become-dj.payments.card-payments.card-payments')}
                        </BlueTitle>
                        <GrayText>{translate('become-dj.payments.card-payments.content')}</GrayText>
                        <ReadMore />
                        <GracefullImage
                            src={paymentCard}
                            animate
                            alt="Payment Card"
                            style={{
                                alignSelf: 'center',
                                width: '95%',
                                marginTop: '60px',
                                flex: '1',
                            }}
                        />
                    </Card>
                    <Card>
                        <ResponsiveTextAccent margin="0 0 15px 0">
                            {translate('become-dj.payments.direct-payments.receive-payments')}
                        </ResponsiveTextAccent>
                        <BlueTitle left>
                            {translate('become-dj.payments.direct-payments.direct-payments')}
                        </BlueTitle>
                        <GrayText>
                            {translate('become-dj.payments.direct-payments.content')}
                        </GrayText>
                        <ReadMore />
                        <GracefullImage
                            src={invoice}
                            animate
                            alt="Payment Card"
                            style={{
                                alignSelf: 'center',
                                width: '95%',
                                marginTop: '60px',
                                flex: '1',
                            }}
                        />
                    </Card>
                </CardsContainer>
            </Container>
        </Bg>
    );
};

export default addTranslate(Payments, content);
