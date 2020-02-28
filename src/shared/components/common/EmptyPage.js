import React, { Component } from 'react';
import { localize } from 'react-localize-redux';
import styled from 'styled-components';
import { Body } from 'components/Text';
import Svg404 from '../graphics/404';

const EmptyPage = ({ message, title, translate }) => {
    return (
        <Wrapper>
            <Svg404 />
            <div>
                <h2>{title ? title : translate('empty-page-message')}</h2>

                {message && <Body style={{ marginTop: 15 }}>{message}</Body>}
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    min-height: 400px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: left;
    flex-wrap: wrap;
    h2 {
        max-width: 220px;
    }
    svg {
        max-width: 300px;
        margin-right: 30px;
    }
    > div {
        max-width: 300px;
    }
`;

export default localize(EmptyPage, 'locale');
