import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTemplateObject } from '../../redux/actions.js';

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
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import grey from '@material-ui/core/colors/grey';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setTemplateObject }, dispatch);
}

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
});

class FlowActionApplication extends Component {

  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      uniqueApps: [],
      appVersions: [],
      appName: "",
      applicationId: 0,
    };
  }

  componentWillMount() {
    apiCall.getlist( '/applications', this.handleGetApplications.bind(this) );
  }

  handleGetApplications( result, data ) {
    if (result) {
      let alist = [];
      data.map(function(index,app){
        if (!alist.some(function(item) {
          return item.name === app.name;
        })) {
          alist.push(app);
        }
      });
      this.setState({ applications: data, uniqueApps: alist });
    } else {
        // Handle error
    }
  }

  setApplicationName = () => event => {
    let aname = event.target.value;
    let vlist = [];
    this.state.applications.map(function(index,app){
      if (!vlist.some(function(item) {
        return item.version === app.version && app.name === aname;
      })) {
        vlist.push(app);
      }
    });
    this.setState({ appVersions: vlist});
  }

  setApplicationVersion = () => event => {
    this.setState({ applicationId: event.target.value });
  }

  setApplication = () => event => {
    this.props.setApplication(this.props.currentState, this.state.applicationId);
  }

  render() {
    const { classes, theme, flowTemplate, currentState } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Select className={classes.select}
            inputProps={{ name: 'application', id: 'application', }}
            value="{this.state.applicationId}" onChange={this.setApplicationName} >
            {this.state.uniqueApps.map((app,index) => (
              <MenuItem value={app.name} key={index}>{app.name}</MenuItem>
            ))}
          </Select>
          <Select className={classes.select}
            inputProps={{ name: 'version', id: 'version', }}
            value="{this.state.applicationId}" onChange={this.setApplicationVersion} >
            {this.state.appVersions.map((app,index) => (
              <MenuItem value={app.id} key={index}>{app.version}</MenuItem>
            ))}
          </Select>
        </Grid>
        {this.state.applicationId!=='' &&
        <Grid item xs={12}>
          loop data
        </Grid>
        }
      </Grid>
    );
  }
}

FlowActionApplication.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(null,mapDispatchToProps)(FlowActionApplication));
