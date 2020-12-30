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

const Logos = styled.section`
    display: grid;
    width: 100%;
    min-height: 115px;
    grid-template-columns: repeat(6, 1fr);
    column-gap: 4em;

    img {
        margin: auto;
        width: 100%;
        opacity: 0.5;
        transition: opacity 500ms cubic-bezier(0.55, -0.01, 0.24, 1.01) 0s;
    }
    img:hover {
        opacity: 1;
    }
    @media only screen and (max-width: 1000px) {
        padding: 0 6em;
        grid-template-columns: repeat(3, 1fr);
        row-gap: 2em;
        column-gap: 4em;
        margin-top: 1.5em;
    }
    @media only screen and (max-width: 766px) {
        padding: 0 1em;
        grid-template-columns: repeat(2, 1fr);
        row-gap: 2em;
    }
`;

const TrustedBy = ({ label = 'Trusted by', style }) => {
    return (
        <Col middle style={{ width: '100%' }}>
            {label && <TextAccent style={{ color: '#4d6480', opacity: 0.5 }}>{label}</TextAccent>}

            <Logos style={style}>
                <GracefullImage src={microsoft} />
                <GracefullImage src={hardRock} />
                <GracefullImage src={hakkasan} />
                <GracefullImage src={politiken} />
                <GracefullImage src={tivoli} />
                <GracefullImage src={louboutin} />
            </Logos>
        </Col>
    );
};

export default TrustedBy;
