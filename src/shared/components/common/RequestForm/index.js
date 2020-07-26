import React from 'react';
import loadable from '@loadable/component';
import { useHistory } from 'react-router';
import Popup from '../Popup';
import Loading from './LoadingRequestForm';

const LazyRequestForm = loadable(() => import('./RequestForm'), { fallback: <Loading /> });

export const RequestFormPopup = () => {
    const history = useHistory();

    return (
        <Popup
            lazy={false}
            noPadding
            showing
            onClose={() => {
                history.goBack();
            }}
        >
            <LazyRequestForm transparent />
        </Popup>
    );
};

export default LazyRequestForm;
