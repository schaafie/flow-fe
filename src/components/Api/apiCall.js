import basicAuth from "../Auth/basicAuth.js";
import axios from 'axios';

const apiCall = {
  baseURL: 'http://localhost:4000/api',

  create(url, dataObject, callback ) {
    axios.request({
      baseURL: this.baseURL,
      url: url,
      method: 'post',
      data: dataObject,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    }).then((response) => {
      console.log(response);
      callback( true, response.data.data );
    }).catch((error) => {
      console.log(error);
      callback( false, error );
    });
  },

  getlist( url, callback ) {
    axios.request({
      baseURL: this.baseURL,
      url: url,
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    }).then((response) => {
      console.log(response);
      callback( true, response.data.data );
    }).catch((error) => {
      console.log(error);
      callback( false, error );
    });
  },

  getItem( url, id, callback ) {
    axios.request({
      baseURL: this.baseURL,
      url: url + id,
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    }).then((response) => {
      console.log(response);
      callback( true, response.data.data );
    }).catch((error) => {
      console.log(error);
      callback( false, error );
    });
  },

  update( url, id, dataObject, callback ) {
    // Do an update
    axios.request({
      baseURL: this.baseURL,
      url: url + id,
      method: 'put',
      data: dataObject,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    }).then((response) => {
      console.log(response);
      callback( true, response.data.data );
    }).catch((error) => {
      console.log(error);
      callback( false, error);
    });
  },

  delete( id, url, callback ) {
    axios.request({
      baseURL: this.baseURL,
      url: url + id,
      method: 'delete',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    }).then((response) => {
      console.log(response);
      callback( true );
    }).catch((error) => {
      console.log(error);
      callback( false, error );
    });
  }
};

export default apiCall;
