import { AsyncStorage } from 'react-native';
import { postLogin } from '../network/auth';
import { fetchFailure } from '../actions';

export const isAuthenticated = async () => {
    const token = await getJWTToken();
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
    console.log('Logging out...');
    await setJWTToken('');
    console.log('Logged out...');
};