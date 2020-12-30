import React from 'react';
import styled from 'styled-components';
import { TextAccent } from 'components/Text';
import { Col, Row } from 'components/Blocks';
import GracefullImage from 'components/GracefullImage';
import hakkasan from '../assets/hakkasan.svg';
import microsoft from '../assets/microsoft.svg';
import hardRock from '../assets/hardrock.svg';
import louboutin from '../assets/louboutin.svg';
import politiken from '../assets/politiken.svg';
import tivoli from '../assets/tivoli.svg';

const Logos = styled(Row)`
    width: 100%;
    min-height: 200px;
    img {
        margin: auto;
        width: 11%;
        max-width: 200px;
        max-height: 80px;
        opacity: 0.5;
        transition: opacity 500ms cubic-bezier(0.55, -0.01, 0.24, 1.01) 0s;
    }
    img:hover {
        opacity: 1;
    }
    margin-bottom: 60px;
`;

const TrustedBy = () => {
    return (
        <Col middle style={{ width: '100%' }}>
            <TextAccent>Trusted by</TextAccent>

            <Logos>
                <GracefullImage
                    src={microsoft}
                    // style={{
                    //     width: '200px',
                    //     height: '60px',
                    // }}
                />
                <GracefullImage
                    src={hardRock}
                    // style={{
                    //     width: '150px',
                    //     maxHeight: '150px',
                    // }}
                />
                <GracefullImage
                    src={hakkasan}
                    style={
                        {
                            // width: '170px',
                            // height: '70px',
                        }
                    }
                />
                <GracefullImage
                    src={politiken}
                    // style={{
                    //     width: '200px',
                    //     maxHeight: '100px',
                    // }}
                />
                <GracefullImage
                    src={tivoli}
                    // style={{
                    //     width: '150px',
                    //     maxHeight: '100px',
                    // }}
                />
                <GracefullImage src={louboutin} />
            </Logos>
        </Col>
    );
};

export default TrustedBy;
