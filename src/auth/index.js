import { AsyncStorage } from 'react-native';
import { postLogin } from '../network/auth';
import { fetchFailure } from '../actions';

export const isAuthenticated = async () => {
    const token = await getJWTToken();
    console.log('checking if authenticated, token: ' + token + ', boolean = ');
    console.log(!!token);
    return !!token;
};

export const getJWTToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const setJWTToken = async token => {
    await AsyncStorage.setItem('token', token);
    return;
};

export const login = async (username, password) => {
    console.log('Logging in...');
    try {
        let response = await postLogin(username, password);
        await setJWTToken(response.token);
        console.log('Logged in...');
        return true;
    } catch (error) {
        fetchFailure(error);
        return false;
    }
};

export const logout = async () => {
    let token = await getJWTToken();
    console.log('Logging out... from token ' + token);
    await setJWTToken('');
    token = await getJWTToken();
    console.log('Logged out... new token: ' + token);
};