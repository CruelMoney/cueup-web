import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Container, ReadMore } from 'components/Blocks';
import { appRoutes } from 'constants/locales/appRoutes';

import { GrayText, Header } from '../Text';
import { TextAccent } from '../blocks/TextAccent';
import GlobeRender from './src';

const ContainerWrapper = styled.div`
    width: 100%;
    height: 1000px;
    margin-top: -400px;
    position: relative;
    display: flex;
    justify-content: flex-end;
    z-index: 0;
`;

const GlobeWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 200px;
    right: 0;
`;

const Bg = styled.div`
    margin-top: auto;
    display: flex;
    justify-content: center;
    width: 100%;
    z-index: 0;
    background-color: #f7f9fc;
    padding: 200px 0;

    @media only screen and (max-width: 768px) {
        padding: 120px 0;
    }
`;

const PlayAnywhere = () => {
    const { t } = useTranslation();
    return (
        <ContainerWrapper>
            <Bg>
                <Container>
                    <div style={{ maxWidth: '500px', position: 'relative', zIndex: 2 }}>
                        <TextAccent margin="0 0 15px 0">TRAVEL AND DJ</TextAccent>
                        <Header mobileTextAlign="left">Play anywhere</Header>
                        <GrayText
                            mobileTextAlign="left"
                            style={{
                                maxWidth: 400,
                                marginBottom: '30px',
                            }}
                        >
                            For ambitious DJs around the world, Cueup lets you set your location to
                            wherever you want. You can even add multiple places you want to get
                            gigs.
                        </GrayText>
                        <NavLink to={t(appRoutes.signUp)} style={{ marginBottom: '42px' }}>
                            <ReadMore size="18px" uppercase={false}>
                                Apply to become DJ
                            </ReadMore>
                        </NavLink>
                    </div>
                    <GlobeWrapper>
                        <GlobeRender />
                    </GlobeWrapper>
                </Container>
            </Bg>
        </ContainerWrapper>
    );
};

export default PlayAnywhere;
