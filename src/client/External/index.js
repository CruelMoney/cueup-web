import { useEffect } from 'react';
import useHotjar from '../../shared/components/hooks/useHotjar';

const excludedScriptsRoutes = [];

const useExternals = () => {
    const { loadHotjar } = useHotjar();

    useEffect(() => {
        const excludeScripts = excludedScriptsRoutes.some((s) =>
            window.location.pathname.includes(s)
        );
        setTimeout(() => {
            if (!excludeScripts) {
                loadHotjar();
            }
        }, 4000);
    }, [loadHotjar]);
};

export default useExternals;
