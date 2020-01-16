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
    position: sticky;
    top: 0px;
    z-index: -1;
    order: 3;
    @media only screen and (max-width: 685px) {
        order: 2;
    }
`;

const GetGigsImageRow = styled(Row)`
    order: 2;
    @media only screen and (max-width: 685px) {
        order: 1;
    }
    justify-content: center;
    margin-top: 10px;
`;

const GracefullImageDJProfile = styled(GracefullImage)`
    width: 100%;
`;

const Laptop = (props) => {
    return (
        <LaptopContainer>
            <Row>
                <GetGigsImageRow>
                    <GracefullImageDJProfile
                        src={DJProfileDesktopImage}
                        animate
                        alt="cueup DJ profile - desktop"
                        style={{ width: '100%' }}
                    />
                </GetGigsImageRow>
            </Row>
        </LaptopContainer>
    );
};

export default addTranslate(Laptop, content);
