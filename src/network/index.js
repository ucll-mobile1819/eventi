import axios from 'axios';
import { getJWTToken } from '../auth';
import { fetchFailure } from '../actions';

export const constructApiUrl = endpoint => {
    endpoint = endpoint.trim();
    return 'http://193.191.176.250' + (endpoint.charAt(0) === '/' ? '' : '/') + endpoint;
};

export const isConnected = async () => {
    let response = await axios.get(constructApiUrl('version'));
    return response.status >= 200 && response.status <= 299;
};

export const getAuthorizationHeader = async () => {
    const token = await getJWTToken();
    if (!token) return null;
    return { 'Authorization': token };
};

/**
 * 
 * @param {String} endpoint 
 * @param {String} method 
 * @param {Boolean} handleErrors 
 * @param {Boolean} checkAuthorized 
 * @param {Object} data 
 * @returns Object. Boolean:false on failure
 */
export const sendAPIRequest = async ( endpoint, method, handleErrors, checkAuthorized = true, data ) => {
    let header;
    if (checkAuthorized) {
        header = await getAuthorizationHeader();
        if (!header) {
            throw { status: 401 };
        }
    }
    header = header || {};
    try {
        let params = [ constructApiUrl(endpoint) ];
        if (data instanceof Object && Object.keys(data).length > 0) {
            params.push(data);
        } else {
            if (method.toLowerCase() === "post") params.push({});
        }
        params.push({
            headers: {
                ...header,
                'Content-Type': 'application/json',
            }
        });
        const response = await axios[method.toLowerCase()](...params);
        return response.data;
    } catch (error) {
        console.log('--------- NETWORK ERROR ---------');
        console.log(error);
        console.log('---------------------------------');

        error = { status: error.response.status, message: error.response.data.error || error.response.data };
        if (handleErrors) {
            fetchFailure(error);
            return false;
        }
        throw error;
    }
};