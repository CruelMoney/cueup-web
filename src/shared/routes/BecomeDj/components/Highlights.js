import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';

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
    color: #ffffff;
    font-weight: 600;
`;

const TextRowColSecondRow = styled(Row)`
    font-size: 32px;
    font-weight: 600;

    color: #ffffff;
`;

const Highlights = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <OrderedContainer>
            <Row>
                <WrapperCol>
                    <TextRow>
                        <TextRowCol>
                            <TextRowColFirstRow>
                                {translate('become-dj.hero.get-gigs.get')}
                            </TextRowColFirstRow>
                            <TextRowColSecondRow>
                                {translate('become-dj.hero.get-gigs.gigs')}
                            </TextRowColSecondRow>
                        </TextRowCol>
                        <TextRowCol>
                            <TextRowColFirstRow>
                                {translate('become-dj.hero.upload-mixtapes.upload')}
                            </TextRowColFirstRow>
                            <TextRowColSecondRow>
                                {translate('become-dj.hero.upload-mixtapes.mixtapes')}
                            </TextRowColSecondRow>
                        </TextRowCol>
                        <TextRowCol>
                            <TextRowColFirstRow>
                                {translate('become-dj.hero.showcase-photos.showcase')}
                            </TextRowColFirstRow>
                            <TextRowColSecondRow>
                                {translate('become-dj.hero.showcase-photos.photos')}
                            </TextRowColSecondRow>
                        </TextRowCol>
                        <TextRowCol>
                            <TextRowColFirstRow>
                                {translate('become-dj.hero.add-reviews.add')}
                            </TextRowColFirstRow>
                            <TextRowColSecondRow>
                                {translate('become-dj.hero.add-reviews.reviews')}
                            </TextRowColSecondRow>
                        </TextRowCol>
                    </TextRow>
                </WrapperCol>
            </Row>
        </OrderedContainer>
    );
};

export default addTranslate(Highlights);
