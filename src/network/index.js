import axios from 'axios';
import { getJWTToken } from '../auth';
import { fetchFailure } from '../actions';
import Snackbar from 'react-native-snackbar';

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
        let timezoneOffset = new Date().getTimezoneOffset()*60*1000;
        let checkKeysForDates = (obj) => {
            if (obj instanceof Array) {
                obj.forEach(el => {
                    if (el instanceof Object) checkKeysForDates(el);
                });
                return;
            }
            if (!(obj instanceof Object)) return;
            Object.keys(obj).forEach(key => {
                if (obj[key] instanceof Object || obj[key] instanceof Array) return checkKeysForDates(obj[key]); 
                if (typeof obj[key] !== 'string') return;
                // Regex for recognising ISO date string
                if (!/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(obj[key])) return;
                obj[key] = new Date(new Date(obj[key]).getTime()+timezoneOffset);
            });
        }
        checkKeysForDates(response.data);
        return response.data;
    } catch (error) {
        console.log('--------- NETWORK ERROR ---------');
        console.log(error);
        console.log('---------------------------------');

        if (!error.response) {
            const showSnackbar = () => Snackbar.show({
                title: 'No internet connection.',
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                    title: 'CLOSE',
                    color: 'red',
                    onPress: () => Snackbar.dismiss(),
                }
            });
            if (handleErrors) {
                fetchFailure({ status: 0, message: 'No internet connection.' }, false);
                showSnackbar();
                return false;
            }
            showSnackbar();
            throw { status: 0, message: 'No internet connection.' };
        }
        error = { status: error.response.status, message: error.response.data.error || error.response.data };
        if (handleErrors) {
            fetchFailure(error);
            return false;
        }
        throw error;
    }
};