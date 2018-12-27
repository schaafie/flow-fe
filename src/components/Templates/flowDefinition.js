import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FlowAction from './flowaction.js';
import FlowView from './flowview.js';

const styles = theme => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class FlowDefinition extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedObject: false,
      persistStates: this.persistStates.bind(this),
      persistData: this.persistData.bind(this),
      selectObject: this.selectObject.bind(this),
      updateObject: this.updateObject.bind(this),
      addObject: this.addObject.bind(this),
      addTerminator: this.addTerminator.bind(this),
      addConnection: this.addConnection.bind(this),
      changeConnection: this.changeConnection.bind(this),
      removeConnection: this.removeConnection.bind(this),
      setApplication: this.setApplication.bind(this)
    };
  }

  setApplication(itemid,appid) {
    this.props.setApplication(itemid, appid);
  }

  persistStates() {
    this.props.persistStates(this.props.flowstates);
  }

  persistData() {
    this.props.persistData(this.props.flowdata);
  }

  selectObject(item) {
    this.setState({selectedObject: item});
  }

  addObject() {
    let newId = 0;
    this.props.flowstates.states.forEach( function(item, index) {
      if (item.state.id > newId) newId = item.state.id;
    });
    let item = { "state":
      { "id": newId+1, "name": "new", "defaultvalue": "", "cando": "",
        "type": "action", "actor": "",
        "location": { "x": 100, "y": 100 },
        "input": "", "output": "", "timed": false, "manual": false }
    };
    this.props.flowstates.states.push(item);
    this.setState({selectedObject: item});
  }

  addTerminator() {
    let newId = 0
    this.props.flowstates.terminators.forEach( function(item, index) {
      if (item.state.id < newId) newId = item.state.id;
    });
    let item = {"state": { "id": newId-1, "type": "end", "name": "new end",
                "location": { "x": 100, "y": 100 } } }
    this.props.flowstates.terminators.push(item);
    this.setState({selectedObject: item});
  }

  updateObject(object, key, value) {
    let updatedObject = object;
    this.props.flowstates.states.forEach( function(item, index) {
      if (item.state.id === object.state.id) {
        this.props.flowstates.states[index] = this.updateObjectProperty( item, key, value );
        this.props.persistStates(this.props.flowstates);
        updatedObject = this.props.flowstates.states[index];
      }
    }, this );
    this.props.flowstates.terminators.forEach( function(item, index) {
      if (item.state.id === object.state.id) {
        this.props.flowstates.terminators[index] = this.updateObjectProperty( item, key, value );
        this.props.persistStates(this.props.flowstates);
        updatedObject = this.props.flowstates.terminators[index];
      }
    }, this );
    this.setState({selectedObject: updatedObject});
  }

  addConnection(origin, direction, target) {
    let maxId = 0;
    this.props.flowstates.connections.forEach(function(conn){
      if (conn.connection.id > maxId) maxId = conn.connection.id;
    });
    // Default output direction
    let newConn = {'connection': {'id': maxId+1, 'from':origin, 'to': target}};
    if (direction=='input') {
      newConn.connection.from = target;
      newConn.connection.to = origin;
    }
    this.props.flowstates.connections.push(newConn);
    this.persistStates();
  }

  changeConnection(conn_id, origin, target) {
    this.props.flowstates.connections.some(function(conn,i) {
      if (conn.connection.id===conn_id) {
        if (this.props.flowstates.connections[i].connection.from===origin) {
          this.props.flowstates.connections[i].connection.to = target;
        } else if (this.props.flowstates.connections[i].connection.to===origin) {
          this.props.flowstates.connections[i].connection.from = target;
        }
        return true;
      }
    }, this);
    this.persistStates();
  }

  removeConnection(conn_id) {
    this.props.flowstates.connections.some(function(conn,index) {
      if (conn.connection.id===conn_id) {
        this.props.flowstates.connections.splice(index,1);
        return true;
      }
    }, this);
    this.persistStates();
  }

  getDestinations() {
    let list = [];
    this.props.flowstates.terminators.forEach(function(element) {
      if (this.state.selectedObject &&
          this.state.selectedObject.state.id!==element.state.id) {
        list.push({'id':element.state.id,'name':element.state.name});
      }
    }, this);
    this.props.flowstates.states.forEach(function(element){
      if (this.state.selectedObject &&
          this.state.selectedObject.state.id!==element.state.id) {
        list.push({'id':element.state.id,'name':element.state.name});
      }
    }, this);
    return list;
  }

  updateObjectProperty( item, key, value ) {
    // Todo case.
    switch (key) {
      case "delta":
        item.state.location.dx = value.dx;
        item.state.location.dy = value.dy;
        break;
      case "input":
        item.state.input = value;
        break;
      case "output":
        item.state.output = value;
        break;
      case "name":
        item.state.name = value;
        break;
      case "timed":
        item.state.timed = value;
        break;
      case "manual":
        item.state.manual = value;
        break;
    }
    return item;
  }

  render() {
    const { classes, flowstates, flowdata, applications } = this.props;
    const destinations = this.getDestinations();

    return(
      <Grid container>
        <Grid item xs={8}>
          <FlowView
            flowactions = {flowstates.states}
            terminators = {flowstates.terminators}
            connections = {flowstates.connections}
            updateObject = {this.state.updateObject}
            selectObject = {this.state.selectObject}
          />
        </Grid>
        <Grid item xs={4}>
          <Paper>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  onClick={this.state.addObject}
                  className={classes.menuButton}
                  color="inherit" aria-label="Add action">
                  <AddIcon />
                </IconButton>
                {this.state.selectedObject!==false &&
                  <IconButton className={classes.menuButton} color="inherit" aria-label="Delete action">
                    <RemoveIcon />
                  </IconButton>
                }
                {this.state.selectedObject!==false &&
                  <IconButton className={classes.menuButton} color="inherit" aria-label="Clone">
                    <FileCopyIcon />
                  </IconButton>
                }
              </Toolbar>
            </AppBar>
            {this.state.selectedObject===false &&
              <div>No item selected</div>
            }
            {this.state.selectedObject!==false &&
              <FlowAction
                item = {this.state.selectedObject}
                connections = {flowstates.connections}
                destinations = {destinations}
                applications = {applications}
                setApplication = {this.state.setApplication}
                updateObject = {this.state.updateObject}
                addConnection = {this.state.addConnection}
                changeConnection = {this.state.changeConnection}
                removeConnection = {this.state.removeConnection} />
            }
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

FlowDefinition.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlowDefinition);
