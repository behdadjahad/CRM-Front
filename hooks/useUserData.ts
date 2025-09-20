import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useUserData = () => {
    const roles = useSelector((state: RootState) => state.login?.roles || []);
    const pageCode = useSelector((state: RootState) => state.navigation?.currentPageCode || '');
    const user = useSelector((state: RootState) => state.user);

    return { roles, pageCode, user };
};
