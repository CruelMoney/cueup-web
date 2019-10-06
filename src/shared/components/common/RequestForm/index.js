import React from 'react';
import loadable from '@loadable/component';
import Loading from './LoadingRequestForm';

const LazyRequestForm = loadable(() => import('./RequestForm'), { fallback: <Loading /> });

export default LazyRequestForm;
