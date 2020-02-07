import React from 'react';
import styled from 'styled-components';
import { Container, Col } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import { Header } from '../components/blocks/Text';
import { TextAccent } from '../components/blocks/TextAccent';
import integrationsGraphic from '../../../assets/images/integrations/Brands.png';
import integrationsGraphicMobile from '../../../assets/images/integrations/Brands_mobile.png';

const TitleWrapper = styled.div`
    max-width: 570px;
    align-self: flex-start;
    @media only screen and (min-width: 376px) {
        position: relative;
        :after {
            content: '';
            background: url(${integrationsGraphic});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            width: 846px;
            height: 764px;
            position: absolute;
            right: 0;
            bottom: 0;
            transform: translate(90%, 90%);
        }
    }
`;

const IntegrationsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 200px;
    padding-left: 120px;
    @media only screen and (max-width: 768px) {
        padding-left: 0px;
    }
    @media only screen and (max-width: 375px) {
        margin-top: 0px;
    }
`;

const IntegrationsCol = styled(Col)`
    width: 100%;
    position: relative;
`;

const IntegrationsText = styled.ul`
    margin-top: 15px;
    margin-bottom: 40px;
    > p {
        font-family: 'AvenirNext-Medium';
        color: #fff;
        letter-spacing: -0.67px;
        font-size: 32px;
    }
    @media only screen and (max-width: 375px) {
        margin-top: 10px;
        margin-bottom: 30px;

        > p {
            font-size: 27px;
        }
    }
`;

const IntegrationsTextStarred = styled(IntegrationsText)`
    > p {
        opacity: 0.5;
        font-size: 15px;
        letter-spacing: -0.31px;
        position: absolute;
        bottom: 15px;
        left: 0;
        @media only screen and (max-width: 375px) {
            font-size: 15px;
        }
    }
`;

const MobileImage = styled.div`
    @media only screen and (max-width: 375px) {
        height: 330px;
        margin: 30px -15px 0 -15px;
        background: no-repeat 50% 100% url(${integrationsGraphicMobile});
        background-size: contain;
    }
`;

const Integrations = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Container>
            <IntegrationsWrapper>
                <IntegrationsCol>
                    <MobileImage />
                    <TextAccent margin="0 0 20px 0">
                        {translate('become-dj.integrations.integrations')}
                    </TextAccent>
                    <TitleWrapper>
                        <Header mobileTextAlign="left" small white>
                            {translate('become-dj.integrations.combine-content-&-sell-yourself')}
                        </Header>
                    </TitleWrapper>
                    <IntegrationsText>
                        <p>Instagram</p>
                        <p>SoundCloud</p>
                        <p>Testimonials</p>
                        <p>{translate('become-dj.integrations.photos')}</p>
                        <p>{translate('become-dj.integrations.videos')}</p>
                        <p>Mixtapes</p>
                        <p>Mixcloud*</p>
                        <p>{translate('become-dj.integrations.more')}</p>
                    </IntegrationsText>
                    <IntegrationsTextStarred>
                        <p>{translate('become-dj.integrations.coming-soon')}</p>
                    </IntegrationsTextStarred>
                </IntegrationsCol>
            </IntegrationsWrapper>
        </Container>
    );
};

export default addTranslate(Integrations);
