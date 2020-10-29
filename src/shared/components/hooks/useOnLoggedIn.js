import { useQuery } from '@apollo/client';
import { ME } from 'components/gql';
import { trackLogin } from 'utils/analytics';
import { authService } from 'utils/AuthService';

const useOnLoggedIn = ({ onLoggedIn, redirect = true } = {}) => {
    const { refetch } = useQuery(ME, { fetchPolicy: 'network-only', skip: true });

    const fun = async ({ token }) => {
        try {
            if (token) {
                authService.setSession(token);

                const { data } = await refetch();

                if (onLoggedIn) {
                    await onLoggedIn(data);
                }
                try {
                    trackLogin();
                } catch (error) {}

                if (data?.me && redirect) {
                    const onboarded = data?.me?.appMetadata?.onboarded;
                    const permalink = data?.me?.permalink;

                    if (onboarded) {
                        window.location.href = 'user/' + permalink + '/overview';
                    } else {
                        window.location.href = '/complete-signup';
                    }
                }
            }
        } catch (err) {
            console.log({ err });
        }
    };

    return fun;
};

export default useOnLoggedIn;
