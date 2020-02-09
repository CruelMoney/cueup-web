import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import Macbook from '../../../assets/images/perf_gallery_hw__bdxj0rf7d3te_large_2x.png';
import screenShot1 from '../assets/screenshots/1.jpg';
import screenShot2 from '../assets/screenshots/2.jpg';
import screenShot3 from '../assets/screenshots/3.jpg';
import screenShot4 from '../assets/screenshots/4.jpg';

const LaptopContainer = styled(Container)`
    display: flex;
    justify-content: center;
    z-index: 1;
`;

const GetGigsImageCol = styled(Col)`
    @media only screen and (max-width: 768px) {
        padding: 0px;
    }
    padding: 0 100px;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

const LaptopImage = styled.img`
    width: 100%;
`;
const LaptopContentImage = styled.img`
    width: 77%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 6%);
`;

const Shadow = styled.div`
    width: 77%;
    height: 35px;
    border-radius: 50% / 100%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: -55px;
    box-shadow: 0 0 80px 0 rgba(255, 255, 255, 0.3);
    z-index: -1;
`;

const Laptop = (props) => {
    return (
        <LaptopContainer>
            <Col>
                <GetGigsImageCol>
                    <div style={{ position: 'relative' }}>
                        <LaptopContentImage src={screenShot4} animate alt="cueup DJ profile " />
                        <LaptopImage src={Macbook} animate alt="macbook 13 inch" />
                    </div>
                    <Shadow />
                </GetGigsImageCol>
            </Col>
        </LaptopContainer>
    );
};

export default addTranslate(Laptop);
