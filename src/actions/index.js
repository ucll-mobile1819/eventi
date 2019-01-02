import { Alert } from 'react-native';

export const FETCH_FAILURE = 'FETCH_FAILURE';

export const fetchFailure = err => {
    let error = {};
    if (err.message) {
        error.message = err.message;
    } else if (err.response && err.response.data && err.response.data.error) {
        error.message = err.response.data.error;
    } else if (err.response && err.response.data) {
        error.message = err.response.data;
    } else if (err.error) {
        error.message = err.error;
    } else {
        error.message = 'Unknown error';
    }

    if (err.status) {
        error.status = err.status;
    } else if (err.request.status) {
        error.status = err.request.status;
    } else {
        error.status = 'unknown';
    }

    const errorMessages = {
        ['401']: {
            title: 'Not authorized',
            message: 'You need to login to see this content.'
        },
        ['403']: {
            title: 'Forbidden',
            message: 'You are not allowed to see this content.'
        },
        ['404']: {
            title: 'Not found',
            message: 'This resource was not found.'
        },
        ['400']: {
            title: 'That didn\'t work',
            message: error.message
        },
        ['500']: {
            title: 'Server error',
            message: 'An error occured on the server. Please report this incident.'
        },
        ['unknown']: {
            title: 'Unknown error',
            message: 'An unknown error occured. Please report this incident. Error code: ' + error.status + '\nError message: ' + error.message
        }
    };

    const generalizeStatusCode = code => {
        if (code == 404 || code == 403 || code == 401) return code.toString();
        if (code >= 400 && code <= 499) return '400';
        if (code >= 500 && code <= 599) return '500';
        return 'unknown';
    };
    Alert.alert(
        errorMessages[generalizeStatusCode(error.status)].title,
        errorMessages[generalizeStatusCode(error.status)].message,
        [{ text: 'OK' }],
        { cancelable: false }
    );
    return {
        type: FETCH_FAILURE,
        payload: { error }
    }
};