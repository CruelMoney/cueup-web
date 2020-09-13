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
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
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
                        <TextAccent margin="0 0 15px 0">LOCATIONS</TextAccent>
                        <Header mobileTextAlign="left">Play anywhere</Header>
                        <GrayText
                            mobileTextAlign="left"
                            style={{
                                maxWidth: 300,
                                marginBottom: '30px',
                            }}
                        >
                            Upload or share your mixtapes directly from SoundCloud.
                        </GrayText>
                        <NavLink
                            to={
                                t(appRoutes.blog) +
                                '/how-to-use-soundcloud-and-mixcloud-on-your-cueup-profile'
                            }
                            style={{ marginBottom: '42px' }}
                        >
                            <ReadMore size="18px" uppercase={false}>
                                Read more
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
