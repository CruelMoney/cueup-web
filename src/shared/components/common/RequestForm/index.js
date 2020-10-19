import React from 'react';
import loadable from '@loadable/component';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import Loading from './LoadingRequestForm';

const LazyRequestForm = loadable(() => import('./RequestForm'), { fallback: <Loading /> });

export const RequestFormPopup = () => {
    const history = useHistory();
    const location = useLocation();

    return (
        <Wrapper>
            <LazyRequestForm transparent />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    background-color: '#fff';
`;

export default LazyRequestForm;
