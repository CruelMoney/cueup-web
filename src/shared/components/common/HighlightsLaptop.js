import React from 'react';
import styled from 'styled-components';
import { Col } from 'components/Blocks';
import addTranslate from '../higher-order/addTranslate';
import { TextAccent } from '../../routes/BecomeDj/components/blocks/TextAccent';
import { Title } from './Title';
import Laptop from './Laptop';
import Highlights from './Highlights';

const Wrapper = styled(Col)`
    position: relative;
    margin: ${({ margin }) => (margin ? margin : '0')};
    @media only screen and (max-width: 425px) {
        flex-direction: column-reverse;
    }
`;
const HighlightsLaptop = (props) => {
    const blue = props.blue ? true : false;
    const {
        text1Row1,
        text1Row2,
        text2Row1,
        text2Row2,
        text3Row1,
        text3Row2,
        text4Row1,
        text4Row2,
        margin,
        textAccent,
        title,
    } = props;
    return (
        <Wrapper margin={margin}>
            <TextAccent center>{textAccent}</TextAccent>
            <Title blue margin="0 0 50px 0">
                {title}
            </Title>
            <Highlights
                blue={blue}
                text1Row1={text1Row1}
                text1Row2={text1Row2}
                text2Row1={text2Row1}
                text2Row2={text2Row2}
                text3Row1={text3Row1}
                text3Row2={text3Row2}
                text4Row1={text4Row1}
                text4Row2={text4Row2}
            />
            <Laptop />
        </Wrapper>
    );
};

export default addTranslate(HighlightsLaptop);
