import React, { Component } from 'react';
import styled from 'styled-components';
import GracefullImage from '../../../../components/GracefullImage';
import addTranslate from '../../../../components/higher-order/addTranslate';
import content from '../../content.json';
import arrow from '../../../../assets/images/arrow_right.png';

const ReadMoreText = styled.p`
    margin-top: 50px;
    font-family: AvenirNext-DemiBold;
    font-size: 20px;
    color: #122b48;
    align-self: flex-end;
    @media only screen and (max-width: 685px) {
        margin-top: 20px;
    }
`;

const ReadMoreWrapper = styled.div`
    display: flex;
    @media only screen and (max-width: 685px) {
        justify-content: center;
    }
`;

const ReadMore = (props) => {
    const { translate, currentLanguage } = props;
    return (
        // <div className="read-more"></div>
        <ReadMoreWrapper>
            <ReadMoreText>
                {translate('become-dj.getting-gigs.get-gigs-feature.read-more')} <br />
            </ReadMoreText>
            <GracefullImage
                src={arrow}
                animate
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
