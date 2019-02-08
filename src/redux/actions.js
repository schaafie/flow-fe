import {
  NEW_TEMPLATE, OPEN_TEMPLATE, SAVE_TEMPLATE, UPDATE_TEMPLATE,
  CHANGE_TEMPLATE_GEN, FLIP_TEMPLATE_AUTH, SET_TEMPLATE_OBJECT,
  ADD_TEMPLATE_DATA, CHANGE_TEMPLATE_DATA, DELETE_TEMPLATE_DATA,
  ADD_TEMPLATE_OBJECT, CHANGE_TEMPLATE_OBJECT, DELETE_TEMPLATE_OBJECT,
  ADD_TEMPLATE_TERMINATOR, CHANGE_TEMPLATE_TERMINATOR, DELETE_TEMPLATE_TERMINATOR,
  ADD_TEMPLATE_CONNECTION, CHANGE_TEMPLATE_CONNECTION, DELETE_TEMPLATE_CONNECTION
} from "./actionTypes";
import basicAuth from "../components/Auth/basicAuth.js";
import axios from 'axios';

const baseURL = 'http://localhost:4000/api';

export const openTemplate = (id) => {
  return (dispatch) => {
    return axios.request({
      baseURL: this.baseURL,
      url: '/templates/' + id,
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    })
    .then((response) => {dispatch(openTemplateSucces(response.data.data)); })
    .catch((error) => {console.log(error);});
  }
};

export const openTemplateSucces = (data) => ({
  type: OPEN_TEMPLATE,
  data: data
});

export const saveTemplate = (dataObject) => {
  return (dispatch) => {
    return axios.request({
      baseURL: this.baseURL,
      url: '/templates',
      method: 'post',
      data: dataObject,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    })
    .then(response => {dispatch(saveTemplateSucces(response.data.data)); })
    .catch(error => {console.log(error);});
  }
};

export const saveTemplateSucces = (data) => ({
  type: SAVE_TEMPLATE,
  data
});

export const updateTemplate = (id,dataObject) => {
  return (dispatch) => {
    return axios.request({
      baseURL: this.baseURL,
      url: '/templates/' + id,
      method: 'put',
      data: { dataObject },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    })
    .then(response => {dispatch(updateTemplateSucces(response.data.data)); })
    .catch((error) => {console.log(error);});
  }
};

export const updateTemplateSucces = (data) => ({
  type: UPDATE_TEMPLATE,
  data
});

export const newTemplate = () => ({
  type: NEW_TEMPLATE
});

export const changeTemplateGen = (name, value) => ({
  type: CHANGE_TEMPLATE_GEN,
  key: name,
  value: value
});

export const addData = (name, type, format, def) => ({
  type: ADD_TEMPLATE_DATA,
  name: name,
  dtype: type,
  format: format,
  def: def
});

export const deleteData = (id) => ({
  type: DELETE_TEMPLATE_DATA,
  id: id
});

export const changeData = (id,name,type,format,def) => ({
  type: CHANGE_TEMPLATE_DATA,
  id: id,
  name: name,
  dtype: type,
  format: format,
  def: def
});

export const flipTemplateAuth = (id, type) => ({
  type: FLIP_TEMPLATE_AUTH,
  id: id,
  ftype: type
});

export const setTemplateObject = (id) => ({
  type: SET_TEMPLATE_OBJECT,
  id: id
})

export const addTemplateObject = () => ({
  type: ADD_TEMPLATE_OBJECT,
  object: {}
})

export const changeTemplateObject = (id, key, value) => ({
  type: CHANGE_TEMPLATE_OBJECT,
  id: id,
  key: key,
  value: value
})

export const deleteTemplateObject = (id) => ({
  type: DELETE_TEMPLATE_OBJECT,
  id: id
})

export const addTemplateTerminator = () => ({
  type: ADD_TEMPLATE_TERMINATOR,
  object: {}
})

export const changeTemplateTerminator = (id, key, value) => ({
  type: CHANGE_TEMPLATE_TERMINATOR,
  id: id,
  key: key,
  value: value
})

export const deleteTemplateTerminator = (id) => ({
  type: DELETE_TEMPLATE_TERMINATOR,
  id: id
})

export const addTemplateConnection = (to, from) => ({
  type: ADD_TEMPLATE_CONNECTION,
  to: to,
  from: from
})

export const changeTemplateConnection = (id, to, from) => ({
  type: CHANGE_TEMPLATE_CONNECTION,
  id: id,
  to: to,
  from: from
})

export const deleteTemplateConnection = (id) => ({
  type: DELETE_TEMPLATE_CONNECTION,
  id: id
})
