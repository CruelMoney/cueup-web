/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../higher-order/addTranslate';

const OrderedContainer = styled(Container)`
    margin-bottom: 15px;
`;

const WrapperCol = styled(Col)`
    flex: 1;
    justify-content: center;
    width: 100%;
`;
const TextRow = styled(Row)`
    flex: 1;
    align-self: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 200px;
    @media only screen and (max-width: 768px) {
        padding: 0 70px;
    }
    @media only screen and (max-width: 425px) {
        margin-top: 15px;
        padding: 0 15px;
    }
`;

const TextRowCol = styled(Col)`
    margin-top: 24px;
    @media only screen and (max-width: 767px) {
        flex-basis: 50%;
        align-items: flex-start;
    }
`;

const TextRowColFirstRow = styled(Row)`
    opacity: 0.5;
    font-size: 15px;
    color: ${({ blue }) => (blue ? '#122b48' : '#fff')};
    font-weight: 600;
`;

const TextRowColSecondRow = styled(Row)`
    font-size: 32px;
    font-weight: 700;
    color: ${({ blue }) => (blue ? '#122b48' : '#fff')};
`;

const Highlights = (props) => {
    const {
        blue,
        translate,
        currentLanguage,
        text1Row1,
        text1Row2,
        text2Row1,
        text2Row2,
        text3Row1,
        text3Row2,
        text4Row1,
        text4Row2,
    } = props;
    return (
        <OrderedContainer>
            <Row>
                <WrapperCol>
                    <TextRow>
                        <TextRowCol>
                            <TextRowColFirstRow blue={blue}>{text1Row1}</TextRowColFirstRow>
                            <TextRowColSecondRow blue={blue}>{text1Row2}</TextRowColSecondRow>
                        </TextRowCol>
                        <TextRowCol>
                            <TextRowColFirstRow blue={blue}>{text2Row1}</TextRowColFirstRow>
                            <TextRowColSecondRow blue={blue}>{text2Row2}</TextRowColSecondRow>
                        </TextRowCol>
                        <TextRowCol>
                            <TextRowColFirstRow blue={blue}>{text3Row1}</TextRowColFirstRow>
                            <TextRowColSecondRow blue={blue}>{text3Row2}</TextRowColSecondRow>
                        </TextRowCol>
                        <TextRowCol>
                            <TextRowColFirstRow blue={blue}>{text4Row1}</TextRowColFirstRow>
                            <TextRowColSecondRow blue={blue}>{text4Row2}</TextRowColSecondRow>
                        </TextRowCol>
                    </TextRow>
                </WrapperCol>
            </Row>
        </OrderedContainer>
    );
};

export default addTranslate(Highlights);
