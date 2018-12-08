import axios from 'axios';
import { isAuthenticated, getJWTToken } from '../auth';

export const constructApiUrl = endpoint => {
    endpoint = endpoint.trim();
    return 'http://193.191.176.250' + (endpoint.charAt(0) === '/' ? '' : '/') + endpoint;
};

export const isConnected = async () => {
    let response = await axios.get(constructApiUrl('version'));
    return response.status >= 200 && response.status <= 299;
};

export const getAuthorizationHeader = () => {
    if (!isAuthenticated()) {
        return null;
    }
    const token = getJWTToken();
    return { 'Authorization': token };
};

/**
 * 
 * @param {String} endpoint 
 * @param {String} method 
 * @param {Boolean} checkAuthorized 
 * @param {Object} data 
 * @returns Object. Boolean:false on failure
 */
export const sendAPIRequest = async ( endpoint, method, checkAuthorized = true, data ) => {
    let header;
    if (checkAuthorized) {
        header = getAuthorizationHeader();
        if (!header) {
            throw { status: 401 };
        }
    }
    try {
        const response = await axios[method.toLowerCase()](constructApiUrl(endpoint), {
            headers: checkAuthorized ? header : {},
            data
        });
        return response.data;
    } catch (error) {
        throw { status: error.response.status, message: error.response.data.error || error.response.data };
    }
};