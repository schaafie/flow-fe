import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTemplateObject,
         addTemplateConnection,
         deleteTemplateConnection } from '../../redux/actions.js';

import apiCall from "../Api/apiCall.js";
import classNames from "classnames";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import grey from '@material-ui/core/colors/grey';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    changeTemplateObject,
    addTemplateConnection,
    deleteTemplateConnection }, dispatch);
}

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflowX: "auto"
  },
  textField: {
    marginRight: theme.spacing.unit
  },
  targetSelect: {
    margin: theme.spacing.unit,
    backgroundColor: grey[100]
  },
  select: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class FlowAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabValue: "Ge",
      targets: this.getTargets(),
      applications: [],
      applicationNames: [],
      applicationName: '',
      applicationVersions: [],
      applicationVersion: '',
      applicationId: 0
    };
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  componentWillMount() {
    this.getApplications(this);
  }

  getApplications() {
    apiCall.getlist( '/applications', this.handleGetApplications.bind(this) );
  }

  handleGetApplications( result, data ) {
    if (result) {
      let appNames = data.map(item => item.name);
      appNames = appNames.filter((x, i, a) => a.indexOf(x) == i);
      this.setState({
        applications: data,
        applicationNames: appNames
      });
    } else {
        // Handle error
    }
  }

  setApplicationName = () => event => {
    let appName = event.target.value;
    let appVersions = this.state.applications.filter(item=>item.name==appName);
    appVersions = appVersions.map( item => item.version );

    this.setState({
      applicationName: appName,
      applicationVersions: appVersions,
      applicationVersion: ''
    })
  }

  setApplicationVersion = () => event => {
    this.setState({ applicationVersion: event.target.value });
  }

  setApplication() {
    this.state.applications.some( app => {
      if (app.name==this.state.applicationName && app.version==this.state.applicationVersion) {
        this.setState({applicationId: app.id});
        // Get application data and create data application object
        let dao = { application: app.name,
                    version: app.version,
                    system: app.definition.system,
                    module: app.definition.module,
                    call: app.definition.call,
                    data: []};
        dao.data = app.definition.data.map( item => {
          return { name: item.name, inout: item.inout, globalitem: '' }
        })

        this.props.changeTemplateObject(this.props.currentState, 'exec', dao );
        return true;
      }
    }, this);
  }

  getTargets() {
    return this.props.flowTemplate.flow.places.map(function(element) {
      return ({'id':element.place.id,'name':element.place.name});
    }, this);
  }

  handleChange = name => event => {
    let value = "";
    switch(name) {
      case "input":
      case "output":
      case "name":
        value = event.target.value;
        break;
      case "manual":
      case "timed":
        value = event.target.checked;
        break;
      }
    this.props.changeTemplateObject( this.props.currentState, name, value);
  };

  getDestinations( origin_id, direction, conn_id) {
    let dlist = [];
    this.state.targets.map( function(element) {
      if (this.props.flowTemplate.flow.connections.some( function(connection) {
          if ( direction==="input" &&
            ( connection.from !== element.id || connection.id === conn_id )
          ) {
            return true;
          } else if ( direction==="output" &&
            ( connection.to !== element.id || connection.id === conn_id )
          ) {
            return true;
          } else {
            return false;
          }
      })) {
        dlist.push(element);
      }
    }, this)
    return dlist;
  }

  removeConnection = conn_id => event => {
    this.props.deleteTemplateConnection(conn_id);
  }

  addConnection = direction => event => {
    if (direction === "p2a") {
      this.props.addTemplateConnection('p2a', this.props.currentState, event.target.value);
    } else {
      this.props.addTemplateConnection('a2p', event.target.value, this.props.currentState);
    }
  }

  changeConnection = conn_id => event => {
    this.props.flowTemplate.flow.connections.some(function(conn) {
      if (conn.id === conn_id) {
        if (conn.type === 'a2p') {
          this.props.changeTemplateConnection(conn_id, conn.type, conn.to, event.target.value);
        } else {
          this.props.changeTemplateConnection(conn_id, conn.type, event.target.value, conn.from );
        }
        return true;
      }
    });
  }

  getCurrentState = (ft, cs) => {
    let state = {};
    ft.flow.states.map(function(item,index){
      if (item.state.id===cs) {
        state = ft.flow.states[index];
      }
    })
    return state;
  }

  render() {
    const { classes, theme, flowTemplate, currentState } = this.props;
    const { tabValue } = this.state;

    const item = this.getCurrentState(flowTemplate, currentState);
    const connections = flowTemplate.flow.connections;

    return (
      <div>
        { item.state.type!=="action" &&
          <p>endpoint</p>
        }
        { item.state.type==="action" &&
        <div>
          <AppBar position="static" color="default">
            <Tabs value={tabValue} onChange={this.handleTabChange}>
              <Tab value="Ge" label="General" />
              <Tab value="Au" label="Auth" />
              <Tab value="Ac" label="Action" />
            </Tabs>
          </AppBar>
          {tabValue === "Ge" &&
          <TabContainer>
            <Grid container>
              <Grid item xs={12}>
                <TextField id="name"
                  label="name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  className={classes.textField}
                  value={item.state.name}
                  onChange={this.handleChange("name")} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                    checked={item.state.manual}
                    control={<Checkbox
                    onChange={this.handleChange("manual")}
                    value="manual"
                    color="primary" /> }
                  label="Manual" />
                <FormControlLabel
                  control={<Checkbox
                    checked={item.state.timed}
                    onChange={this.handleChange("timed")}
                    value="timed"
                    color="primary" /> }
                  label="Timed" />
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="input">Input</InputLabel>
                      <Select
                        value={item.state.input}
                        onChange={this.handleChange("input")}
                        inputProps={{ name: 'input', id: 'input', }} >
                        <MenuItem value=""><em>None</em> </MenuItem>
                        <MenuItem value="AND">And</MenuItem>
                        <MenuItem value="OR">Or</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} className={classes.targetSelect}>
                    <Grid container>
                    { connections.map((conn, key) => (
                      (item.state.id===conn.connection.to) && (conn.connection.type==='p2a') &&
                      <Grid item xs={12} key={key}>
                        <Select
                          className={classes.select}
                          inputProps={{name: 'input',id: 'input'}}
                          value={conn.connection.from}
                          onChange={this.changeConnection(conn.connection.id)} >
                          {this.getDestinations(item.state.id, 'input', conn.connection.id).map((el,index) => (
                            <MenuItem value={el.id} key={index}>
                              {el.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <IconButton
                          onClick={this.removeConnection(conn.connection.id)}
                          className={classes.menuButton}
                          color="inherit" aria-label="Remove connection">
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      ))}
                      <Grid item xs={12} className={classes.targetSelect}>
                        <Select
                          className={classes.select}
                          inputProps={{ name: 'input_new', id: 'input_new', }}
                          value=""
                          onChange={this.addConnection("p2a")} >
                          {this.getDestinations(item.state.id, 'input', false).map((el,index) => (
                            <MenuItem value={el.id} key={index}>
                              {el.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="output">Output</InputLabel>
                      <Select
                        value={item.state.output}
                        onChange={this.handleChange("output")}
                        inputProps={{ name: 'output', id: 'output', }} >
                        <MenuItem value=""><em>None</em> </MenuItem>
                        <MenuItem value="AND">And</MenuItem>
                        <MenuItem value="OR">Or</MenuItem>
                        <MenuItem value="XOR">XOr</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} className={classes.targetSelect}>
                    <Grid container>
                    { connections.map((conn, key) => (
                      (item.state.id===conn.connection.from) && (conn.connection.type==='a2p') &&
                      <Grid item xs={12} key={key}>
                        <Select
                          className={classes.select}
                          inputProps={{name: 'output',id: 'output'}}
                          value={conn.connection.to}
                          onChange={this.changeConnection(conn.connection.id)} >
                          {this.getDestinations(item.state.id, 'output', conn.connection.id).map((el,index) => (
                            <MenuItem value={el.id} key={index}>
                              {el.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <IconButton
                          onClick={this.removeConnection(conn.connection.id)}
                          className={classes.menuButton}
                          color="inherit" aria-label="Remove connection">
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      ))}
                      <Grid item xs={12} className={classes.targetSelect}>
                        <Select
                          className={classes.select}
                          inputProps={{ name: 'output_new', id: 'output_new', }}
                          value=""
                          onChange={this.addConnection("a2p")} >
                          {this.getDestinations(item.state.id, 'output', false).map((el,index) => (
                            <MenuItem value={el.id} key={index}>
                              {el.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabContainer>}
          {tabValue === "Au" &&
          <TabContainer>
            Authorisation
          </TabContainer>}
          {tabValue === "Ac" &&
          <TabContainer>
            <Grid container>
              <Grid item xs={6}>
                <Select className={classes.select}
                  inputProps={{ name:'applicationname', id:'applicationname' }}
                  value={this.state.applicationName}
                  onChange={this.setApplicationName()} >
                  {this.state.applicationNames.map((name,index) => (
                  <MenuItem value={name} key={index}>{name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={4}>
                <Select className={classes.select}
                  inputProps={{ name:'applicationversion', id:'applicationversion' }}
                  value={this.state.applicationVersion}
                  onChange = {this.setApplicationVersion()} >
                  {this.state.applicationVersions.map((version,index) => (
                  <MenuItem value={version} key={index}>{version}</MenuItem>
                  ))}
                </Select>
              </Grid>
            {this.state.applicationVersion!=='' &&
              <Grid item xs={2}>
                <IconButton
                  onClick={this.setApplication.bind(this)}
                  className={classes.menuButton}
                  color="inherit" aria-label="Set Application">
                  <ThumbUpIcon />
                </IconButton>
              </Grid>
            }
            </Grid>
            {this.state.applicationId!==0 && item.state.exec.data.map((dataitem, key) => (
            <Grid container key={key}>
              <Grid item xs={5}>
                <span>{dataitem.name}</span>
              </Grid>
              <Grid item xs={2}>
                <span>{dataitem.inout}</span>
              </Grid>
              <Grid item xs={5}>
                <span>{dataitem.globalitem}</span>
              </Grid>
            </Grid>
            ))}
          </TabContainer>
        }
        </div>
      }
    </div>
    );
  }
}

FlowAction.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(null,mapDispatchToProps)(FlowAction));
