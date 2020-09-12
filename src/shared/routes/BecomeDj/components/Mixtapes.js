import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Container, ReadMore } from 'components/Blocks';
import { appRoutes } from 'constants/locales/appRoutes';
import { Card } from './PaymentCards';
import { GrayText, Header } from './Text';
import { TextAccent } from './blocks/TextAccent';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    z-index: 0;
    position: relative;
`;

const Mixtapes = () => {
    const { t } = useTranslation();
    return (
        <Bg>
            <Container>
                <Card>
                    <TextAccent center margin="0 0 15px 0">
                        FEATURE
                    </TextAccent>
                    <Header center mobileTextAlign="center" small>
                        Upload mixtapes
                    </Header>
                    <NavLink to={appRoutes.blog} style={{ textAlign: 'center' }}>
                        <ReadMore size="18px" uppercase={false}>
                            Read more
                        </ReadMore>
                    </NavLink>
                    <img
                        src="https://cdn-images-1.medium.com/max/1024/1*eblJRWpNZfqhbrQX_Uz8cg.png"
                        alt="Cueup sound player"
                    />
                </Card>
            </Container>
        </Bg>
    );
};

export default Mixtapes;
