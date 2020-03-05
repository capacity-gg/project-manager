import axios from 'axios';
import store from '@/store/store.js';

const customAxios = (function(instance) {
    // Set x-token header on outgoing requests
    instance.interceptors.request.use(function(config) {
        return config;
    }, 
    function(error) {
        return Promise.reject(error);
    });

    // Handle error response code is 401
    instance.interceptors.response.use(null, function(error) {
        if (error.response && error.response.status === 401) {            
            // Dispatch logout
        }

        return Promise.reject(error);
    });

    return instance;
})(axios.create());

export default (function() {
    return customAxios;
})()
