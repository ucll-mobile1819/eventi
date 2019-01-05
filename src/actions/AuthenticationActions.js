import { fetchFailure } from ".";
import * as authAPI from '../network/auth';
import { logout, setJWTToken } from "../auth";

export const FETCH_LOGIN_BEGIN = 'FETCH_LOGIN_BEGIN';
export const FETCH_LOGIN_SUCCESS = 'FETCH_LOGIN_SUCCESS';
export const FETCH_LOGOUT_BEGIN = 'FETCH_LOGOUT_BEGIN';
export const FETCH_LOGOUT_SUCCESS = 'FETCH_LOGOUT_SUCCESS';
export const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

export const fetchLogin = (username, password) => dispatch => {
    dispatch(fetchLoginBegin());

    let tmpUser;
    return authAPI.postLogin(username, password)
        .then(result => {
            tmpUser = result.user;
            return setJWTToken(result.token);
        })
        .then(() => dispatch(fetchLoginSuccess(tmpUser)))
        .catch(error => dispatch(fetchFailure(error)));
};

export const fetchLoginBegin = () => ({
    type: FETCH_LOGOUT_BEGIN,
});

export const fetchLoginSuccess = user => ({
    type: FETCH_LOGIN_SUCCESS,
    payload: { user },
});

export const fetchLogoutBegin = () => ({
    type: FETCH_LOGOUT_BEGIN,
});

export const fetchLogoutSuccess = () => ({
    type: FETCH_LOGOUT_SUCCESS,
});

export const fetchLogout = () => dispatch => {
    dispatch(fetchLogoutBegin());

    return logout()
    .then(() => dispatch(fetchLogoutSuccess()))
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchUser = () => dispatch => {
    dispatch(fetchUserBegin());

    return authAPI.getUser()
    .then(user => {
        if (user.birthday !== null) user.birthday = new Date(user.birthday);
        dispatch(fetchUserSuccess(user));
    })
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchUserBegin = () => ({
    type: FETCH_USER_BEGIN
});

export const fetchUserSuccess = user => ({
    type: FETCH_USER_SUCCESS,
    payload: { user },
});