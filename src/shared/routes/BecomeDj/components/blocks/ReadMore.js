import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import GracefullImage from '../../../../components/GracefullImage';
import addTranslate from '../../../../components/higher-order/addTranslate';
import content from '../../content.json';
import arrow from '../../../../assets/images/arrow_right.png';
import whiteArrow from '../../../../assets/images/white_arrow.png';

const ReadMoreText = styled.p`
    margin-top: 40px;
    font-family: AvenirNext-DemiBold;
    font-size: 20px;
    color: ${({ white }) => (white ? 'white' : '#122b48')};
    align-self: flex-end;
    @media only screen and (max-width: 685px) {
        margin-top: 20px;
    }
    ${({ noMargin }) => (noMargin ? 'margin-top: 0px;' : '')}
`;

const ReadMoreWrapper = styled.div`
    display: flex;
    ${({ mobileCenter }) =>
        mobileCenter &&
        css`
            @media only screen and (max-width: 685px) {
                justify-content: center;
            }
        `}
`;

const ReadMore = (props) => {
    const { white, translate, noMargin, mobileCenter = true } = props;
    return (
        <ReadMoreWrapper mobileCenter={mobileCenter}>
            <ReadMoreText white={white} noMargin={noMargin}>
                {translate('become-dj.getting-gigs.get-gigs-feature.read-more')} <br />
            </ReadMoreText>
            <img
                src={white ? whiteArrow : arrow}
                alt="right arrow"
                style={{
                    marginLeft: '15px',
                    maxWidth: '14px',
                    alignSelf: 'flex-end',
                    paddingBottom: '12px',
                }}
            />
        </ReadMoreWrapper>
    );
};

export default addTranslate(ReadMore, content);
