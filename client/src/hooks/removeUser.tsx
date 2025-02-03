import { removeAccessToken } from '@/config/redux/reducers/tokenSlice';
import { removeUser } from '@/config/redux/reducers/userSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux'

function useRemoveUser() {
    const dispatch = useDispatch();
    const router = useRouter();
    const removeUserAndRedirect = () => {
        dispatch(removeAccessToken());
        dispatch(removeUser());
        router.replace('/');
    };
    return removeUserAndRedirect
}

export default useRemoveUser