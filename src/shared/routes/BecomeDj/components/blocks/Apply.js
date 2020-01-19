import React, { Component } from 'react';
import styled from 'styled-components';
import GracefullImage from '../../../../components/GracefullImage';
import addTranslate from '../../../../components/higher-order/addTranslate';
import arrow from '../../../../assets/images/arrow_right.png';
import whiteArrow from '../../../../assets/images/white_arrow.png';

const ApplyText = styled.p`
    margin-top: 40px;
    font-family: AvenirNext-DemiBold;
    font-size: 20px;
    color: ${({ white }) => (white ? 'white' : '#122b48')};
    align-self: flex-end;
    @media only screen and (max-width: 685px) {
        margin-top: 20px;
    }
`;

const ApplyWrapper = styled.div`
    display: flex;
    justify-content: center;
    @media only screen and (max-width: 685px) {
        justify-content: center;
    }
`;

const Apply = (props) => {
    const { white, translate, currentLanguage } = props;
    return (
        <ApplyWrapper>
            <ApplyText white={white}>
                {translate('become-dj.join-thousands-of-DJs.apply-to-become-DJ')} <br />
            </ApplyText>
            <GracefullImage
                src={white ? whiteArrow : arrow}
                animate
                alt="right arrow"
                style={{
                    marginLeft: '15px',
                    maxWidth: '14px',
                    alignSelf: 'flex-end',
                    paddingBottom: '12px',
                }}
            />
        </ApplyWrapper>
    );
};

export default addTranslate(Apply);
