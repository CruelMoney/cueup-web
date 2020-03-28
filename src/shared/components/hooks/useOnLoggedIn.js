import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { ME } from 'components/gql';
import { authService } from 'utils/AuthService';

const useOnLoggedIn = ({ onLoggedIn } = {}) => {
    const { refetch } = useQuery(ME);
    const history = useHistory();

    const fun = async ({ token }) => {
        if (token) {
            authService.setSession(token);

            const { data } = await refetch();

            if (onLoggedIn) {
                await onLoggedIn(data);
            }

            const onboarded = data?.me?.appMetadata?.onboarded;
            const permalink = data?.me?.permalink;

            if (onboarded) {
                history.push('user/' + permalink + '/overview');
            } else {
                history.push('/complete-signup');
            }
        }
    };

    return fun;
};

export default useOnLoggedIn;
