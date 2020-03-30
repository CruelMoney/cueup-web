import React from 'react';
import loadable from '@loadable/component';
import { LoadingPlaceholder2 } from '../../components/common/LoadingPlaceholder';

const Loader = () => (
    <div className="container">
        <LoadingPlaceholder2 />
    </div>
);

const Lazyterms = loadable(() => import('./Terms'), {
    fallback: <Loader />,
});

export default Lazyterms;
