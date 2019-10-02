import React from 'react';
import Loadable from 'react-loadable';
import { LoadingPlaceholder2 } from '../../components/common/LoadingPlaceholder';

const Loader = () => (
    <div className="container">
        <LoadingPlaceholder2 />
    </div>
);

const AsyncTerms = Loadable({
    loader: () => import('./Terms'),
    loading: Loader,
});

export default AsyncTerms;
