import axios from 'axios';

export const constructApiUrl = endpoint => {
    endpoint = endpoint.trim();
    return 'http://www.mocky.io/v2/5c06c1423300002c00ef2beb'; // Fake api which returns (200) manually created groups for testing purposes
    //return 'http://www.mocky.io/v2/5c0725be3000007f00d259a6'; // Returns 404
    //return 'http://www.mocky.io/v2/5c0725e23000007700d259a7'; // Returns 400 with custom error message
    //return 'http://www.mocky.io/v2/5c0725fe3000008700d259a9'; // Returns 400 with random text
    //return 'http://www.mocky.io/v2/5c0726173000007700d259aa'; // Returns 500 with server error

    //return 'http://193.191.176.250' + (endpoint.charAt(0) === '/' ? '' : '/') + endpoint;
};

export const isConnected = async () => {
    let response = await axios.get(constructApiUrl('version'));
    return response.status >= 200 && response.status <= 299;
};

export const getAuthorizationHeader = () => {
    // if (!auth.isAuthenticated()) {
    //     return null;
    // }
    // const token = auth.getJWTToken();
    // return { 'Authorization': token };
};

/**
 * 
 * @param {String} endpoint 
 * @param {String} method 
 * @param {Boolean} checkAuthorized 
 * @param {Object} data 
 * @returns Object. Boolean:false on failure
 */
export let sendAPIRequest = async ( endpoint, method, checkAuthorized, data ) => {
    let header;
    if (checkAuthorized) {
        //header = getAuthorizationHeader();
        if (!header) {
            throw { status: 401 };
        }
    }
    try {
        let response = await axios[method.toLowerCase()](constructApiUrl(endpoint), {
            headers: checkAuthorized ? header : {},
            data
        });
        return response.data;
    } catch (error) {
        throw { status: error.response.status, message: error.response.data.error || error.response.data };
    }
};