import loadable from '@loadable/component';
import { useEffect } from 'react';

const Olark = loadable(() => import('./olark'));

const useExternals = () => {
    useEffect(() => {
        setTimeout(() => {
            Olark.preload();
        }, 4000);
    }, []);
};

export default useExternals;
