import React from 'react';
import loadable from '@loadable/component';
import styled from 'styled-components';
import Menu from 'components/Navigation';
import Loading from './LoadingRequestForm';

const LazyRequestForm = loadable(() => import('./RequestForm'), { fallback: <Loading /> });

export const RequestFormPopup = () => {
    return (
        <>
            <Menu dark relative />
            <Wrapper>
                <LazyRequestForm transparent />
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    background-color: '#fff';
`;

export default LazyRequestForm;
