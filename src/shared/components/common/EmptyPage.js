import React from 'react';
import styled from 'styled-components';
import { Body } from 'components/Text';
import useTranslate from 'components/hooks/useTranslate';
import Svg404 from '../graphics/404';

const EmptyPage = ({ message, title, style }) => {
    const { translate } = useTranslate();
    const renderTitle = title ? title : translate('empty-page-message');

    return (
        <Wrapper style={style}>
            <Svg404 />
            <div>
                {typeof renderTitle === 'string' ? (
                    <h2
                        dangerouslySetInnerHTML={{
                            __html: renderTitle,
                        }}
                    />
                ) : (
                    <h2>{renderTitle}</h2>
                )}

                {message &&
                    (typeof message === 'string' ? (
                        <Body
                            style={{ marginTop: 15 }}
                            dangerouslySetInnerHTML={{ __html: message }}
                        />
                    ) : (
                        <Body style={{ marginTop: 15 }}>{message}</Body>
                    ))}
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
