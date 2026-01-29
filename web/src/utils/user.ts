import { store } from "../store/store";

export const isUserInfos = () => {
    const state = store.getState();
    const userData = state.user.userInfo as any;

    if (!userData || !userData.user) {
        return false;
    }

    const user = userData.user;

    if (user.firstName && user.lastName && user.email) {
        return true;
    }

    return false;
}
