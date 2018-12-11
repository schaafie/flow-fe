import React, { Component } from 'react';
import apiCall from "../Api/apiCall.js";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FlowDefinition from "./flowDefinition";
import templatejson from './template.json';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
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
  button: {
    margin: theme.spacing.unit * 2
  },
  header: {
    paddingBottom: theme.spacing.unit
  }
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

class State extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabValue: "G",
      item: props.item
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };


  render() {
    const { classes, theme } = this.props;
    const { tabValue } = this.state;

    return (
      {this.state.item &&
      <div>
        <AppBar position="static" color="default">
          <Tabs value={tabValue} onChange={this.handleTabChange}>
            <Tab value="G" label="General" />
            <Tab value="A" label="Authorisation" />
            <Tab value="D" label="Data" />
            <Tab value="F" label="Flow" />
          </Tabs>
        </AppBar>
        {tabValue === "G" &&
        <TabContainer>
          <TextField id="name" label="name" fullWidth margin="normal" variant="outlined"
            className={classes.textField} value={this.state.name} onChange={this.handleChange("name")}
          />
          <TextField id="version" label="version" margin="normal" variant="outlined"
            className={classes.textField} value={this.state.version} InputProps={{ readOnly: true }}
          />
          <TextField id="description" multiline label="description" fullWidth margin="normal" variant="outlined"
            className={classes.textField} value={this.state.description} onChange={this.handleChange("description")}
          />
        </TabContainer>}
        {tabValue === "A" &&
        <TabContainer>
          Authorisation
        </TabContainer>}
        {tabValue === "D" &&
        <TabContainer>
          Data
        </TabContainer>}
        <Grid container justify="flex-end">
          <Button variant="contained" aria-label="Add" color="primary" className={classes.button} onClick={this.handleOnSubmit} >
            Apply
          </Button>
        </Grid>
      </div>
      }
    );
  }
}

State.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(State);
