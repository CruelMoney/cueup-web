import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';

const OrderedContainer = styled(Container)`
    z-index: -2;
    order: 1;
    padding: 0 5%;
    @media only screen and (max-width: 685px) {
        order: 2;
    }
`;

const WrapperCol = styled(Col)`
    flex: 1;
    justify-content: center;
    width: 100%;
`;
const TextRow = styled(Row)`
    order: 1;
    flex: 1;
    align-self: center;
    justify-content: space-between;
    width: 71%;
    flex-wrap: wrap;
    @media only screen and (max-width: 375px) {
        order: 2;
        margin-top: 20px;
        width: 100%;
    }
`;

const TextRowCol = styled(Col)`
    @media only screen and (max-width: 375px) {
        flex-basis: 100%;
    }
    @media only screen and (min-width: 375px) and (max-width: 685px) {
        flex-basis: 50%;
    }
`;
const TextRowCol1 = styled(TextRowCol)`
    order: 1;
`;
const TextRowCol2 = styled(TextRowCol)`
    order: 2;
`;
const TextRowCol3 = styled(TextRowCol)`
    order: 3;
    @media only screen and (max-width: 685px) {
        order: 4;
    }
`;
const TextRowCol4 = styled(TextRowCol)`
    order: 4;
    @media only screen and (max-width: 685px) {
        order: 3;
    }
`;

const TextRowColFirstRow = styled(Row)`
    opacity: 0.5;
    font-family: AvenirNext-DemiBold;
    font-size: 15px;
    color: #ffffff;
`;

const TextRowColSecondRow = styled(Row)`
    font-family: AvenirNext-Bold;
    font-size: 32px;
    color: #ffffff;
`;

const Highlights = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <OrderedContainer>
            <Row>
                <WrapperCol>
                    <TextRow>
                        <TextRowCol1>
                            <TextRowColFirstRow>
                                {translate('become-dj.hero.get-gigs.get')}
                            </TextRowColFirstRow>
                            <TextRowColSecondRow>
                                {translate('become-dj.hero.get-gigs.gigs')}
                            </TextRowColSecondRow>
                        </TextRowCol1>
                        <TextRowCol2>
                            <TextRowColFirstRow>
                                {translate('become-dj.hero.upload-mixtapes.upload')}
                            </TextRowColFirstRow>
                            <TextRowColSecondRow>
                                {translate('become-dj.hero.upload-mixtapes.mixtapes')}
                            </TextRowColSecondRow>
                        </TextRowCol2>
                        <TextRowCol3>
                            <TextRowColFirstRow>
                                {translate('become-dj.hero.showcase-photos.showcase')}
                            </TextRowColFirstRow>
                            <TextRowColSecondRow>
                                {translate('become-dj.hero.showcase-photos.photos')}
                            </TextRowColSecondRow>
                        </TextRowCol3>
                        <TextRowCol4>
                            <TextRowColFirstRow>
                                {translate('become-dj.hero.add-reviews.add')}
                            </TextRowColFirstRow>
                            <TextRowColSecondRow>
                                {translate('become-dj.hero.add-reviews.reviews')}
                            </TextRowColSecondRow>
                        </TextRowCol4>
                    </TextRow>
                </WrapperCol>
            </Row>
        </OrderedContainer>
    );
};

export default addTranslate(Highlights, content);
