import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'components/Blocks';
import { Body } from 'components/Text';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import ButtonLinkGlow from './blocks/ButtonLinkGlow';

const OrderedContainer = styled(Container)`
    z-index: -2;
    order: 2;
    @media only screen and (max-width: 685px) {
        order: 3;
    }
`;

const SubTitle = styled(Body)`
    font-size: 20px;
    text-align: center;
    width: 336px;
    margin: auto;
`;

const HeroCol = styled(Col)`
    margin-top: 145px;
    width: 550px;
`;

const HeroButtonLink = styled(ButtonLinkGlow)`
    display: block;
    margin-top: 40px;
    font-size: 18px;
    height: 50px;
    box-shadow: 0px 0px 30px 30px #31daff;
`;

const GetGigsWrapperCol = styled(Col)`
    flex: 1;
    justify-content: center;
    width: 100%;
`;
const GetGigsTextRow = styled(Row)`
    order: 1;
    flex: 1;
    align-self: center;
    justify-content: space-between;
    width: 83%;
    flex-wrap: wrap;
    @media only screen and (max-width: 375px) {
        order: 2;
        margin-top: 20px;
        width: 100%;
    }
`;

const GetGigsTextRowCol = styled(Col)`
    padding: 10px;
    @media only screen and (max-width: 375px) {
        flex-basis: 100%;
    }
    @media only screen and (min-width: 375px) and (max-width: 375px) {
        flex-basis: 50%;
    }
`;
const GetGigsTextRowCol1 = styled(GetGigsTextRowCol)`
    order: 1;
`;
const GetGigsTextRowCol2 = styled(GetGigsTextRowCol)`
    order: 2;
`;
const GetGigsTextRowCol3 = styled(GetGigsTextRowCol)`
    order: 3;
    @media only screen and (max-width: 685px) {
        order: 4;
    }
`;
const GetGigsTextRowCol4 = styled(GetGigsTextRowCol)`
    order: 4;
    @media only screen and (max-width: 685px) {
        order: 3;
    }
`;

const GetGigsTextRowColFirstRow = styled(Row)`
    opacity: 0.5;
    font-family: AvenirNext-DemiBold;
    font-size: 12px;
    color: #ffffff;
`;

const GetGigsTextRowColSecondRow = styled(Row)`
    font-family: AvenirNext-Bold;
    font-size: 32px;
    color: #ffffff;
`;

const GracefullImageDJProfile = styled(GracefullImage)`
    width: 100%;
`;

const Highlights = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <OrderedContainer>
            <Row>
                <GetGigsWrapperCol>
                    <GetGigsTextRow>
                        <GetGigsTextRowCol1>
                            <GetGigsTextRowColFirstRow>
                                {translate('become-dj.hero.get-gigs.get')}
                            </GetGigsTextRowColFirstRow>
                            <GetGigsTextRowColSecondRow>
                                {translate('become-dj.hero.get-gigs.gigs')}
                            </GetGigsTextRowColSecondRow>
                        </GetGigsTextRowCol1>
                        <GetGigsTextRowCol2>
                            <GetGigsTextRowColFirstRow>
                                {translate('become-dj.hero.upload-mixtapes.upload')}
                            </GetGigsTextRowColFirstRow>
                            <GetGigsTextRowColSecondRow>
                                {translate('become-dj.hero.upload-mixtapes.mixtapes')}
                            </GetGigsTextRowColSecondRow>
                        </GetGigsTextRowCol2>
                        <GetGigsTextRowCol3>
                            <GetGigsTextRowColFirstRow>
                                {translate('become-dj.hero.showcase-photos.showcase')}
                            </GetGigsTextRowColFirstRow>
                            <GetGigsTextRowColSecondRow>
                                {translate('become-dj.hero.showcase-photos.photos')}
                            </GetGigsTextRowColSecondRow>
                        </GetGigsTextRowCol3>
                        <GetGigsTextRowCol4>
                            <GetGigsTextRowColFirstRow>
                                {translate('become-dj.hero.add-reviews.add')}
                            </GetGigsTextRowColFirstRow>
                            <GetGigsTextRowColSecondRow>
                                {translate('become-dj.hero.add-reviews.reviews')}
                            </GetGigsTextRowColSecondRow>
                        </GetGigsTextRowCol4>
                    </GetGigsTextRow>
                </GetGigsWrapperCol>
            </Row>
        </OrderedContainer>
    );
};

export default addTranslate(Highlights, content);
