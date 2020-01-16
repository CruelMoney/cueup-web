import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import DJProfileDesktopImage from '../../../assets/images/desktop-cueup.png';

const LaptopContainer = styled(Container)`
    display: flex;
    justify-content: center;
    z-index: -1;
    order: 2;
    position: sticky;
    top: -82px;
    @media only screen and (max-width: 685px) {
        order: 1;
    }
`;

const GetGigsImageCol = styled(Col)`
    order: 2;
    @media only screen and (max-width: 685px) {
        order: 1;
    }
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

const GracefullImageDJProfile = styled(GracefullImage)`
    width: 100%;
`;

const Shadow = styled.div`
    width: 77%;
    height: 1vw;
    border-radius: 50% / 100%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 2vw 3vw rgba(255, 255, 255, 0.1);
`;

const Laptop = (props) => {
    return (
        <LaptopContainer>
            <Col>
                <GetGigsImageCol>
                    <GracefullImageDJProfile
                        src={DJProfileDesktopImage}
                        animate
                        alt="cueup DJ profile - desktop"
                        style={{ width: '100%' }}
                    />
                    <Shadow />
                </GetGigsImageCol>
            </Col>
        </LaptopContainer>
    );
};

export default addTranslate(Laptop, content);
