import axios from 'axios';
import Cookies from 'js-cookie'


let config = {
    headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': Cookies.get('csrftoken')
    }
}


// API Axios Get Call.
export const getAPICall = (url) => {
    return axios.get(url, config);
}
// API Axios Post Call.
export const postAPICall = (url, data) => {
    return axios.post(url, data, config);
}

// API Axios Post Call.
export const postAPICall2 = (url, data, config) => {
    return axios.post(url, data, config);
}

// API Axios Put Call.
export const putAPICall = (url, data) => {
    return axios.put(url, data, config);
}
// API Axios Delete Call.
export const deleteAPICall = (url) => {
    return axios.delete(url,config);
}