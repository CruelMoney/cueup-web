import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Container, ReadMore } from 'components/Blocks';
import { appRoutes } from 'constants/locales/appRoutes';

import { GrayText, Header } from '../Text';
import { TextAccent } from '../blocks/TextAccent';
import GlobeRender from './src';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    z-index: 0;
    position: relative;
    background-color: #f7f9fc;
    padding: 200px 0;
    padding-top: 300px;
`;

const PlayAnywhere = () => {
    const { t } = useTranslation();
    return (
        <Bg>
            <Container style={{ zIndex: 2 }}>
                <TextAccent margin="0 0 15px 0">LOCATIONS</TextAccent>
                <Header mobileTextAlign="center">Play anywhere</Header>
                <GrayText
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
            </Container>
            <GlobeRender />
        </Bg>
    );
};

export default PlayAnywhere;
