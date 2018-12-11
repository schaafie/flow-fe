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
import Paper from "@material-ui/core/Paper";
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

class Template extends Component {
  constructor() {
    super();
    this.state = {
      tabValue: "G",
      templateid: '',
      name: '',
      version: '0.1',
      can_start: '',
      current: false,
      flowstates: templatejson.flow.flow,
      flowdata: templatejson.flow.data
    };
  }

  add

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleOnSubmit = e => {
    e.preventDefault();
    const { templateid, name, version, description, can_start, current, definition } = this.state;

    let data = {
      template: {
        name: name,
        version: version,
        description: description,
        can_start: can_start,
        current: current,
        definition: definition
      }
    };

    if (templateid!=='') {
      apiCall.update( '/templates/', templateid, data, this.handleUpdate.bind(this) );
    } else {
      apiCall.create('/templates', data, this.handleUpdate.bind(this) );
    }
  }

  handleUpdate(result, data) {
    if (result) {
      this.getData(data.id);
    } else {
      // Handle result
    }
  }

  handleGetItem(result, data) {
    if (result) {
      this.setState({
        templateid: data.id,
        name: data.name,
        version: data.version,
        description: data.description,
        can_start: data.can_start,
        current: data.current,
        flowstates: data.definition.flow.flow,
        flowdata: data.definition.flow.data
      });
    } else {
      // Handle error
    }
  }

  persistStates(flow) {
    this.setState({flowstates: flow});
  }

  persistData(data) {
    this.setState({flowdata: data});
  }

  getData(id) {
    apiCall.getItem( '/templates/', id, this.handleGetItem.bind(this) );
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getData(this.props.match.params.id);
    }
  }

  render() {
    const { classes, theme } = this.props;
    const { tabValue } = this.state;

    return (
      <div>
        <Paper className={classes.root}>
          <Typography variant="h6" color="inherit" className={classes.header}>
            Template details
          </Typography>
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
           {tabValue === "F" &&
             <TabContainer>
               <Grid container>
                 <FlowDefinition
                   flowstates={this.state.flowstates}
                   persistStates={this.persistStates.bind(this)}
                   flowdata={this.state.flowdata}
                   persistData={this.persistData.bind(this)}/>
               </Grid>
             </TabContainer>}
          <Grid container justify="flex-end">
            <Button variant="contained" aria-label="Add" color="primary" className={classes.button} onClick={this.handleOnSubmit} >
              Save
            </Button>
          </Grid>
        </Paper>
      </div>
    );
  }
}

Template.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Template);
