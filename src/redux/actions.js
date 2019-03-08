import {
  NEW_TEMPLATE, SET_TEMPLATE_OBJECT, SET_TEMPLATE_PLACE,
  OPEN_TEMPLATE, OPEN_TEMPLATE_SUCCES,
  SAVE_TEMPLATE, SAVE_TEMPLATE_SUCCES,
  UPDATE_TEMPLATE, UPDATE_TEMPLATE_SUCCES,
  CHANGE_TEMPLATE_GEN, FLIP_TEMPLATE_AUTH,
  ADD_TEMPLATE_DATA, CHANGE_TEMPLATE_DATA, DELETE_TEMPLATE_DATA,
  ADD_TEMPLATE_OBJECT, CHANGE_TEMPLATE_OBJECT, DELETE_TEMPLATE_OBJECT,
  CHANGE_TEMPLATE_OBJECT_DATA,
  ADD_TEMPLATE_PLACE, CHANGE_TEMPLATE_PLACE, DELETE_TEMPLATE_PLACE,
  ADD_TEMPLATE_CONNECTION, CHANGE_TEMPLATE_CONNECTION, DELETE_TEMPLATE_CONNECTION
} from "./actionTypes";
import basicAuth from "../components/Auth/basicAuth.js";
import axios from 'axios';

const baseURL = 'http://localhost:4000/api';

export const openTemplate = (id) => {
  return (dispatch) => {
    return axios.request({
      baseURL: baseURL,
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
  type: OPEN_TEMPLATE_SUCCES,
  data: data
});

export const saveTemplate = () => {
  return (dispatch, getState)  => {
    const {current} = getState().template;
    return axios.request({
      baseURL: baseURL,
      url: '/templates',
      method: 'post',
      data: {
        template: {
          name: current.name,
          version: current.version,
          description: current.description,
          can_start: current.canstart,
          definition: current
        }
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ basicAuth.jwt
      }
    })
    .then(response => {
      dispatch(saveTemplateSucces(response.data.data))
    })
    .catch(error => {
      console.log(error);
    });
  }
};

export const saveTemplateSucces = (data) => ({
  type: SAVE_TEMPLATE_SUCCES,
  data: data
});

export const updateTemplate = (id,dataObject) => {
  return (dispatch) => {
    return axios.request({
      baseURL: this.baseURL,
      url: '/templates/' + id,
      method: 'put',
      data: {
        template: {
          id: id,
          name: dataObject.name,
          version: dataObject.version,
          description: dataObject.description,
          can_start: dataObject.canstart,
          definition: dataObject
        }
      },
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

export const setTemplatePlace = (id) => ({
  type: SET_TEMPLATE_PLACE,
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

export const changeTemplateObjectData = (id, key, value) => ({
  type: CHANGE_TEMPLATE_OBJECT_DATA,
  id: id,
  key: key,
  value: value
})

export const deleteTemplateObject = (id) => ({
  type: DELETE_TEMPLATE_OBJECT,
  id: id
})

export const addTemplatePlace = () => ({
  type: ADD_TEMPLATE_PLACE,
  object: {}
})

export const changeTemplatePlace = (id, key, value) => ({
  type: CHANGE_TEMPLATE_PLACE,
  id: id,
  key: key,
  value: value
})

export const deleteTemplatePlace = (id) => ({
  type: DELETE_TEMPLATE_PLACE,
  id: id
})

export const addTemplateConnection = (ctype, to, from) => ({
  type: ADD_TEMPLATE_CONNECTION,
  ctype: ctype,
  to: to,
  from: from
})

export const changeTemplateConnection = (id, ctype, to, from) => ({
  type: CHANGE_TEMPLATE_CONNECTION,
  id: id,
  ctype: ctype,
  to: to,
  from: from
})

export const deleteTemplateConnection = (id) => ({
  type: DELETE_TEMPLATE_CONNECTION,
  id: id
})
