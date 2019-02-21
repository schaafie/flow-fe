import objectjson from './object.json';
import terminatorjson from './terminator.json';
import templatejson from './template.json';

import {
  NEW_TEMPLATE, OPEN_TEMPLATE, OPEN_TEMPLATE_SUCCES,
  SAVE_TEMPLATE, UPDATE_TEMPLATE, SAVE_TEMPLATE_SUCCES,
  CHANGE_TEMPLATE_GEN, FLIP_TEMPLATE_AUTH,
  ADD_TEMPLATE_DATA, DELETE_TEMPLATE_DATA, CHANGE_TEMPLATE_DATA,
  ADD_TEMPLATE_OBJECT, CHANGE_TEMPLATE_OBJECT, DELETE_TEMPLATE_OBJECT,
  SET_TEMPLATE_OBJECT,
  ADD_TEMPLATE_TERMINATOR, CHANGE_TEMPLATE_TERMINATOR, DELETE_TEMPLATE_TERMINATOR,
  ADD_TEMPLATE_CONNECTION, CHANGE_TEMPLATE_CONNECTION, DELETE_TEMPLATE_CONNECTION
} from "../actionTypes";

function templateReducer( state={current:{},currentState:false,currentid:false}, action) {
  let fdata = {};
  let newState = {};
  let newConn = {};
  let maxId = 0;
  let newId = 0;
  let index = 0;

  switch(action.type) {
    case NEW_TEMPLATE:
      return {
        ...state,
        current: templatejson,
        currentid: false
      }

    case SAVE_TEMPLATE_SUCCES:
      return {
        ...state,
        currentid: action.data.id
      }

    case UPDATE_TEMPLATE:
      return state;

    case OPEN_TEMPLATE_SUCCES:
      return {
        ...state,
        current: action.data.definition,
        currentid: action.data.id
      }

    case CHANGE_TEMPLATE_GEN:
      return {
        ...state,
        current: {
          ...state.current,
          [action.key]: action.value
        }
      }

    case ADD_TEMPLATE_DATA:
      maxId = 0;
      state.current.flow.data.forEach(function(item){
        if (item.id>maxId) {maxId=item.id}
      });
      fdata = state.current.flow.data.concat({
        id: maxId+1,
        name: action.name,
        type: action.dtype,
        format: action.format,
        default: action.def
      });
      return {
        ...state,
        current: {
          ...state.current,
          flow: {
            ...state.current.flow,
            data: fdata
          }
        }
      }

    case CHANGE_TEMPLATE_DATA:
      let cdata = state.current.flow.data;
      state.current.flow.data.map((item,index) => {
        if(item.id===action.id) {
          cdata = [ ...state.current.flow.data.slice(0, index),
             { id: action.id,
               name: action.name,
               type: action.dtype,
               format: action.format,
               default: action.def },
            ...state.current.flow.data.slice(index + 1)];
        }
      });
      return {
        ...state,
        current: {
          ...state.current,
          flow: {
            ...state.current.flow,
            data: cdata
          }
        }
      }

    case DELETE_TEMPLATE_DATA:
      let ddata = state.current.flow.data;
      state.current.flow.data.map((item,index) => {
        if(item.id===action.id) {
          ddata = [ ...state.current.flow.data.slice(0, index),
                    ...state.current.flow.data.slice(index + 1) ];
        }
      });
      return {
        ...state,
        current: {
          ...state.current,
          flow: {
            ...state.current.flow,
            data: ddata
          }
        }
      }

    case FLIP_TEMPLATE_AUTH:
      let flipusers = state.current.canstart.users;
      let fliproles = state.current.canstart.roles;
      switch(action.ftype) {
        case 'users':
          index = flipusers.indexOf(action.id);
          if (index===-1) {
            flipusers.push(action.id);
          } else {
            flipusers.splice(index,1);
          }
          break;
        case 'roles':
          index = fliproles.indexOf(action.id);
          if (index===-1) {
            fliproles.push(action.id);
          } else {
            fliproles.splice(index,1);
          }
          break;
      }
      return {
        ...state,
        current: {
          ...state.current,
          canstart: { users: flipusers, roles: fliproles }
        }
      }

    case SET_TEMPLATE_OBJECT:
      return {
        ...state,
        currentState: action.id
      }

    case ADD_TEMPLATE_OBJECT:
      newId = 1;
      state.current.flow.states.forEach( function(item, index) {
        if (item.state.id >= newId) newId = item.state.id + 1;
      });
      newState = objectjson;
      newState.state.id = newId;

      return {
        ...state,
        currentState: newId,
        current: {
          ...state.current,
          flow: {
            ...state.current.flow,
            states: [
              ...state.current.flow.states,
              newState
            ]
          }
        }
      }

    case ADD_TEMPLATE_TERMINATOR:
      newId = -1;
      state.current.flow.terminators.forEach( function(item, index) {
        if (item.state.id <= newId) newId = item.state.id - 1;
      });

      newState = terminatorjson;
      newState.state.id = newId;

      return {
        ...state,
        currentState: newId,
        current: {
          ...state.current,
          flow: {
            ...state.current.flow,
            terminators: [
              ...state.current.flow.terminators.states,
              newState
            ]
          }
        }
      }

    case ADD_TEMPLATE_CONNECTION:
      maxId = 0;
      state.current.flow.connections.forEach(function(conn){
        if (conn.connection.id > maxId) maxId = conn.connection.id;
      });
      newConn = {
        'connection': {
          'id': maxId+1,
          'from': action.from,
          'to': action.to
        }
      };

      return {
        ...state,
        current: {
          ...state.current,
          flow: {
            ...state.current.flow,
            connections: [
              ...state.current.flow.connections,
              newConn
            ]
          }
        }
      }

    case DELETE_TEMPLATE_OBJECT:
      index = 0;
      state.current.flow.states.map(function(item,index) {
        if (item.state.id===action.id) {
          return {
            ...state,
            current: {
              ...state.current,
              flow: {
                ...state.current.flow,
                states: [
                  ...state.current.flow.states.slice(0, index),
                  ...state.current.flow.states.slice(index+1)
                ]
              }
            }
          }
        }
      });
      return state;

    case DELETE_TEMPLATE_TERMINATOR:
      index = 0;
      state.current.flow.terminators.map(function(item,index) {
        if (item.state.id===action.id) {
          return {
            ...state,
            current: {
              ...state.current,
              flow: {
                ...state.current.flow,
                terminators: [
                  ...state.current.flow.terminators.slice(0, index),
                  ...state.current.flow.terminators.slice(index+1)
                ]
              }
            }
          }
        }
      });
      return state;

    case DELETE_TEMPLATE_CONNECTION:
      index = 0;
      state.current.flow.connections.map(function(item,index) {
        if (item.connection.id===action.id) {
          return {
            ...state,
            current: {
              ...state.current,
              flow: {
                ...state.current.flow,
                connections: [
                  ...state.current.flow.connections.slice(0, index),
                  ...state.current.flow.connections.slice(index+1)
                ]
              }
            }
          }
        }
      });
      return state;

    case CHANGE_TEMPLATE_OBJECT:
      newState = {};
      state.current.flow.terminators.map(function(item,index) {
        if (item.state.id===action.id) {
          let updatedState = state.current.flow.terminators[index];
          updatedState.state[action.key] = action.value;
          newState = {
            ...state,
            current: {
              ...state.current,
              flow: {
                ...state.current.flow,
                terminators: [
                  ...state.current.flow.terminators.slice(0, index),
                  updatedState,
                  ...state.current.flow.terminators.slice(index+1)
                ]
              }
            }
          }
        }
      });
      state.current.flow.states.map(function(item,index) {
        if (item.state.id===action.id) {
          let updatedState = state.current.flow.states[index];
          updatedState.state[action.key] = action.value;
          newState = {
            ...state,
            current: {
              ...state.current,
              flow: {
                ...state.current.flow,
                states: [
                  ...state.current.flow.states.slice(0, index),
                  updatedState,
                  ...state.current.flow.states.slice(index+1)
                ]
              }
            }
          }
        }
      });
      return newState;

    case CHANGE_TEMPLATE_TERMINATOR:
      newState = {};
      state.current.flow.terminators.map(function(item,index) {
        if (item.state.id===action.id) {
          let updatedState = state.current.flow.terminators[index];
          updatedState.state[action.key] = action.value;

          newState = {
            ...state,
            current: {
              ...state.current,
              flow: {
                ...state.current.flow,
                terminators: [
                  ...state.current.flow.terminators.slice(0, index),
                  updatedState,
                  ...state.current.flow.terminators.slice(index+1)
                ]
              }
            }
          }
        }
      });
      return newState;

    case CHANGE_TEMPLATE_CONNECTION:
      newConn = {};
      newState = {};
      state.current.flow.connections.map(function(item,index) {
        if (item.connection.id===action.id) {
          newConn = item.connection;
          newConn.to = action.to;
          newConn.from = action.from;

          newState = {
            ...state,
            current: {
              ...state.current,
              flow: {
                ...state.current.flow,
                connections: [
                  ...state.current.flow.connections.slice(0, index),
                  newConn,
                  ...state.current.flow.connections.slice(index+1)
                ]
              }
            }
          }
        }
      });
      return newState;

    default :
      return state;
  }
}

export default templateReducer;
