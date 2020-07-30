import React from 'react';
import loadable from '@loadable/component';
import { useHistory, useLocation } from 'react-router';
import Popup from '../Popup';
import Loading from './LoadingRequestForm';

const LazyRequestForm = loadable(() => import('./RequestForm'), { fallback: <Loading /> });

export const RequestFormPopup = () => {
    const history = useHistory();
    const location = useLocation();

    return (
        <Popup
            lazy={false}
            noPadding
            showing
            onClose={() => {
                const newRoute = location.pathname.split('book-dj')[0];
                history.push(newRoute);
            }}
        >
            <LazyRequestForm transparent />
        </Popup>
    );
};

export default LazyRequestForm;
