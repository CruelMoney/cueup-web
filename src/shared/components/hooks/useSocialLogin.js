import { useState } from 'react';
import { useServerContext } from './useServerContext';

const useSocialLogin = () => {
    const { environment } = useServerContext();
    const [socialLoading, setSocialLoading] = useState(null);

    const onPressSocial = (social) => (e) => {
        e.preventDefault();
        setSocialLoading(social);
        const redirect = '?redirect=' + window.location.href;
        window.location.replace(environment.GQL_DOMAIN + '/auth/' + social + redirect);
    };

    return [onPressSocial, { socialLoading }];
};

export default useSocialLogin;
