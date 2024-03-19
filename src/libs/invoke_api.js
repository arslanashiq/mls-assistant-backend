const axios = require('axios');

axios.defaults.headers.post['Content-Type'] = 'application/json';

async function invoke_api({ url, method = 'GET', headers = {}, queryParams = {}, postData = {} }) {
    let reqObj = {
        method  : method,
        url     : url,
        headers : headers
    };

    reqObj['params'] = queryParams;

    if (method === 'POST') {
        reqObj['data'] = postData;
    }

    let results = undefined;

    try {
        results = await axios(reqObj);
        return results.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.log(error.response.data.message);
            throw new Error(error.response.data.message);
        } else if (error.response && error.response.status && error.response.statusText) {
            if (error.response.status === 401) {
                throw new Error('Unauthentication');
            }
            throw new Error(error.response.statusText);
        } else {
            throw new Error('NETWORK ERROR : Some Thing Went Wrong!');
        }
    }
}

module.exports.invokeApi = invoke_api;
