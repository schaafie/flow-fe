import React, { Component } from 'react';
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
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";


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
      tabValue: "G"
    };
  }

  handleChange = name => event => {
    switch(name) {
      case "input":
      case "output":
      case "name":
      this.props.updateObject( this.props.item, name, event.target.value);
        break;
      case "manual":
      case "timed":
        this.props.updateObject( this.props.item, name, event.target.checked);
        break;
    }
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  getDestinations( origin_id, direction, conn_id) {
    let list = [];
    let targets = this.props.destinations;
    targets.forEach( function(element) {
      this.props.connections.some(function(connection) {
        if (direction==="input") {
          if (connection.from !== element.id || connection.id === conn_id) {
            list.push(element);
            return true;
          }
        } else if (direction==="output") {
          if (connection.to !== element.id || connection.id === conn_id) {
            list.push(element);
            return true;
          }
        }
      });
    }, this)
    return list;
  }

  removeConnection = conn_id => event => {
    this.props.removeConnection(conn_id);
  }

  addConnection = direction => event => {
    this.props.addConnection(this.props.item.state.id, direction, event.target.value);
  }

  changeConnection = conn_id => event => {
    this.props.changeConnection(conn_id, this.props.item.state.id, event.target.value);
  }

  render() {
    const { classes, theme, item, connections } = this.props;
    const { tabValue } = this.state;

    return (
      <div>
        { item.state.type!=="action" &&
          <p>endpoint</p>
        }
        { item.state.type==="action" &&
        <div>
          <AppBar position="static" color="default">
            <Tabs value={tabValue} onChange={this.handleTabChange}>
              <Tab value="G" label="Action" />
              <Tab value="A" label="Auth" />
              <Tab value="D" label="Data" />
            </Tabs>
          </AppBar>
          {tabValue === "G" &&
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
                      (item.state.id===conn.connection.to) &&
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
                          onChange={this.addConnection("input")} >
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
                      (item.state.id===conn.connection.from) &&
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
                          onChange={this.addConnection("output")} >
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
          {tabValue === "A" &&
          <TabContainer>
            Authorisation
          </TabContainer>}
          {tabValue === "D" &&
          <TabContainer>
            Data
          </TabContainer>}
        </div>
      }
    </div>
    );
  }
}

FlowAction.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlowAction);
