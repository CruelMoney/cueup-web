import React from 'react';
import styled from 'styled-components';
import { Body } from 'components/Text';
import Svg404 from '../graphics/404';

const EmptyPage = ({ message, title, translate }) => {
    return (
        <Wrapper>
            <Svg404 />
            <div>
                <h2
                    dangerouslySetInnerHTML={{
                        __html: title ? title : translate('empty-page-message'),
                    }}
                />
                {message && (
                    <Body style={{ marginTop: 15 }} dangerouslySetInnerHTML={{ __html: message }} />
                )}
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

export default EmptyPage;
