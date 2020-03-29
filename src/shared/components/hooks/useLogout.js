import { authService } from '../../utils/AuthService';

export const useLogout = () => {
    return async () => {
        authService.logout();
        // client.writeData({ data: { me: null } });
    };
};
