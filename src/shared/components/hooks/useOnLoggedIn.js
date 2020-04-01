import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { ME } from 'components/gql';
import { authService } from 'utils/AuthService';

const useOnLoggedIn = ({ onLoggedIn, redirect = true } = {}) => {
    const { refetch } = useQuery(ME, { fetchPolicy: 'network-only', skip: true });
    const history = useHistory();

    const fun = async ({ token }) => {
        try {
            if (token) {
                authService.setSession(token);

                const { data } = await refetch();

                if (onLoggedIn) {
                    await onLoggedIn(data);
                }

                if (data?.me && redirect) {
                    const onboarded = data?.me?.appMetadata?.onboarded;
                    const permalink = data?.me?.permalink;

                    if (onboarded) {
                        history.push('user/' + permalink + '/overview');
                    } else {
                        history.push('/complete-signup');
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
