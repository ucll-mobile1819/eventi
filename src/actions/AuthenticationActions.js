import { fetchFailure } from ".";
import * as authAPI from '../network/auth';
import { logout, setJWTToken } from "../auth";

export const FETCH_LOGIN_BEGIN = 'FETCH_LOGIN_BEGIN';
export const FETCH_LOGIN_SUCCESS = 'FETCH_LOGIN_SUCCESS';
export const FETCH_LOGOUT_BEGIN = 'FETCH_LOGOUT_BEGIN';
export const FETCH_LOGOUT_SUCCESS = 'FETCH_LOGOUT_SUCCESS';

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