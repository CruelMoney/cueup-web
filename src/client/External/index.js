import loadable from '@loadable/component';
import { useEffect } from 'react';

const Olark = loadable(() => import('./olark'));

const useExternals = () => {
    useEffect(() => {
        Olark.preload();
    }, []);
};

export default useExternals;
