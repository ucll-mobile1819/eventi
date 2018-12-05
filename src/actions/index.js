import { Alert } from 'react-native';

export const FETCH_FAILURE = 'FETCH_FAILURE';

export const fetchFailure = error => {
    console.log(error);
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
            title: 'Warning',
            message: error.message === undefined ? error.response.data.error : error.message
        },
        ['500']: {
            title: 'Server error',
            message: 'An error occured on the server. Please report this incident.'
        },
        ['unknown']: {
            title: 'Unknown error',
            message: 'An unknown error occured. Please report this incident. Error code: ' + error.status === undefined ? error.request.status : error.status
        }
    };

    const generalizeStatusCode = code => {
        if (code === 404 || code === 403 || code === 401) return code.toString();
        if (code >= 400 && code <= 499) return '400';
        if (code >= 500 && code <= 599) return '500';
        return 'unknown';
    };
    Alert.alert(
        errorMessages[generalizeStatusCode(error.status || error.request.status)].title,
        errorMessages[generalizeStatusCode(error.status || error.request.status)].message,
        [{ text: 'OK' }],
        { cancelable: false }
    );
    return {
        type: FETCH_FAILURE,
        payload: { error }
    }
};