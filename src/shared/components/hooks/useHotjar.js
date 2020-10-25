import { useCallback } from 'react';
import { useHotjar as useHotjarRaw } from 'react-use-hotjar';

const isProd = process.env.NODE_ENV === 'production';

const useHotjar = () => {
    const { initHotjar } = useHotjarRaw();

    const loadHotjar = useCallback(() => {
        if (isProd) {
            initHotjar('2059938');
        }
    }, [initHotjar]);

    return {
        loadHotjar,
    };
};

export default useHotjar;
