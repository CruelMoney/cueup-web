import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import GracefullImage from '../../../components/GracefullImage';
import { TextAccent } from '../components/blocks/TextAccent';
import { GrayText, Header } from '../components/blocks/Text';
import ReadMore from '../components/blocks/ReadMore';
import paymentCard from '../../../assets/images/credit_card.png';
import invoice from '../../../assets/images/Invoice.png';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    order: 6;
    margin-bottom: -84px;
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
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.06), 0 13px 13px 0 rgba(0, 0, 0, 0.08),
        0 20px 15px 0 rgba(0, 0, 0, 0.04);
    border-radius: 28px;
    padding: 67px 39px 0 39px;
    margin: 15px;
    overflow: hidden;
    .read-more p {
        margin-top: 12px;
    }
    h2 {
        margin-left: -3px;
    }
    > img {
        margin-top: 60px;
    }
    @media only screen and (max-width: 685px) {
        margin: 0px;
        margin-top: 15px;
        padding: 24px 36px 0 24px;
        p {
            margin-top: 6px;
        }
        > img {
            margin-top: 20px;
        }
    }
`;

const Payments = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <CardsContainer>
                    <CardItem
                        translate={translate}
                        header={translate('become-dj.payments.card-payments.card-payments')}
                        description={translate('become-dj.payments.card-payments.content')}
                        imgSrc={paymentCard}
                    />
                    <CardItem
                        translate={translate}
                        header={translate('become-dj.payments.direct-payments.direct-payments')}
                        description={translate('become-dj.payments.direct-payments.content')}
                        imgSrc={invoice}
                    />
                </CardsContainer>
            </Container>
        </Bg>
    );
};

const CardItem = ({ translate, header, description, imgSrc }) => (
    <Card>
        <TextAccent margin="0 0 15px 0">
            {translate('become-dj.payments.card-payments.receive-payments')}
        </TextAccent>
        <Header mobileTextAlign="left" small>
            {header}
        </Header>
        <GrayText mobileTextAlign="left">{description}</GrayText>
        <div className="read-more">
            <ReadMore mobileCenter={false} className="read-more" />
        </div>
        <div style={{ flex: 1 }} />
        <GracefullImage
            src={imgSrc}
            animate
            alt="Payment Card"
            style={{
                alignSelf: 'center',
                width: '100%',

                top: '1px',
                position: 'relative',
            }}
        />
    </Card>
);

export default addTranslate(Payments);
