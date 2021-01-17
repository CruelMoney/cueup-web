import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Container, Col } from 'components/Blocks';
import GracefullImage from 'components/GracefullImage';
import integrationsGraphic from '../assets/integrations/Brands.png';
import integrationsGraphicMobile from '../assets/integrations/Brands_mobile.png';
import { Header } from './Text';
import { TextAccent } from './blocks/TextAccent';

const TitleWrapper = styled.div`
    max-width: 570px;
    align-self: flex-start;
    @media only screen and (min-width: 426px) {
        position: relative;
        :after {
            content: '';
            background: url(${integrationsGraphic});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            width: 635px;
            height: 573px;
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 0;
            -webkit-transform: translate(90%, 90%);
            -ms-transform: translate(90%, 90%);
            transform: translate(105%, 80%);
        }
    }
`;

const IntegrationsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 200px;
    padding-left: 120px;
    .mobile-integrations {
        display: none;
        object-fit: contain;
        height: 330px;
        margin: 30px -15px 0 -15px;
    }
    @media only screen and (max-width: 768px) {
        padding-left: 0px;
    }
    @media only screen and (max-width: 425px) {
        margin-top: 0px;
        .mobile-integrations {
            display: block;
        }
    }
`;

const IntegrationsCol = styled(Col)`
    width: 100%;
    position: relative;
`;

const IntegrationsText = styled.ul`
    margin-top: 15px;
    margin-bottom: 40px;
    column-count: 2;
    max-width: 500px;
    position: relative;
    z-index: 1;
    > p {
        font-weight: 600;
        color: #fff;
        letter-spacing: -0.67px;
        font-size: 32px;
    }
    @media only screen and (max-width: 425px) {
        margin-top: 24px;
        margin-bottom: 15px;

        > p {
            font-size: 20px;
        }
    }
`;

const IntegrationsTextStarred = styled(IntegrationsText)`
    > p {
        opacity: 0.5;
        font-size: 15px;
        bottom: 15px;
        @media only screen and (max-width: 375px) {
            font-size: 15px;
        }
    }
`;

const Integrations = () => {
    const { t } = useTranslation();
    return (
        <Container style={{ overflow: 'hidden' }}>
            <IntegrationsWrapper>
                <IntegrationsCol>
                    <GracefullImage
                        animate
                        lazyload
                        src={integrationsGraphicMobile}
                        style={{ backgroundColor: 'transparent' }}
                        className="mobile-integrations"
                        alt="soundcloud mixcloud"
                    />
                    <TextAccent margin="0 0 20px 0">SELL YOURSELF</TextAccent>
                    <TitleWrapper>
                        <Header mobileTextAlign="left" small white>
                            {t('become-dj:integrations.combine-content-&-sell-yourself')}
                        </Header>
                    </TitleWrapper>
                    <IntegrationsText>
                        <p>Instagram</p>
                        <p>SoundCloud</p>
                        <p>Testimonials</p>
                        <p>{t('become-dj:integrations.photos')}</p>
                        <p>{t('become-dj:integrations.videos')}</p>
                        <p>Mixtapes</p>
                        <p>Mixcloud</p>
                        <p>{t('become-dj:integrations.more')}</p>
                    </IntegrationsText>
                </IntegrationsCol>
            </IntegrationsWrapper>
        </Container>
    );
};

export default Integrations;
