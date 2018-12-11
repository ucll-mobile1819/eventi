import { AsyncStorage } from 'react-native';

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