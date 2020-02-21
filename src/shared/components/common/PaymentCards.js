import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { TextAccent } from 'routes/BecomeDj/components/blocks/TextAccent';
import paymentCard from '../../assets/images/credit_card.jpg';
import invoice from '../../assets/images/Invoice.jpg';
import { ReadMore } from '../Blocks';
import GracefullImage from '../GracefullImage';
import { Header, GrayText } from './Text';

const Card = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.06), 0 13px 13px 0 rgba(0, 0, 0, 0.08),
        0 20px 15px 0 rgba(0, 0, 0, 0.04);
    border-radius: 28px;
    padding: 39px 39px 0 39px;
    margin: 12px;
    overflow: hidden;
    .read-more p {
        margin-top: 12px;
    }
    h2 {
        margin-left: -3px;
    }
    > .card-image {
        margin-top: 60px;
        border-radius: 18px 18px 0 0;
    }
    @media only screen and (max-width: 768px) {
        padding: 30px 30px 0 30px;
        p {
            margin-top: 6px;
        }
        > .card-image {
            margin-top: 30px;
        }
    }
    @media only screen and (max-width: 425px) {
        margin: 0px;
        margin-top: 15px;
        padding: 24px 36px 0 24px;
        p {
            margin-top: 6px;
        }
        > .card-image {
            margin-top: 20px;
        }
    }
`;

const CardItem = ({ header, description, imgSrc, accent, link }) => (
    <Card>
        <TextAccent margin="0 0 15px 0">{accent}</TextAccent>
        <Header mobileTextAlign="left" small>
            {header}
        </Header>
        <GrayText mobileTextAlign="left">{description}</GrayText>
        {!!link && (
            <NavLink to={link} style={{ marginTop: '20px' }}>
                <ReadMore size="18px" uppercase={false}>
                    Read more
                </ReadMore>
            </NavLink>
        )}
        <div style={{ flex: 1 }} />
        <GracefullImage
            src={imgSrc}
            animate
            lazyload
            className="card-image"
            alt="Payment Card"
            style={{
                alignSelf: 'center',
                width: '100%',
                top: '1px',
                position: 'relative',
                minHeight: '100px',
            }}
        />
    </Card>
);
const CardsContainer = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    @media only screen and (max-width: 685px) {
        flex-direction: column;
    }
    margin: ${({ margin }) => (margin ? margin : '0')};
`;

export const PaymentCards = (props) => {
    const { margin, header1, header2, description1, description2, accent, link } = props;
    return (
        <CardsContainer margin={margin}>
            <CardItem
                accent={accent}
                header={header1}
                description={description1}
                imgSrc={paymentCard}
                link={link}
            />

            <CardItem
                accent={accent}
                header={header2}
                description={description2}
                imgSrc={invoice}
                link={link}
            />
        </CardsContainer>
    );
};

export default PaymentCards;
