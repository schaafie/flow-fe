import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { newTemplate, openTemplate, saveTemplate, changeTemplateGen } from '../../redux/actions.js';

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
import FlowDefinition from "./flowdefinition";
import FlowAuth from './flowauth.js';
import FlowData from './flowdata.js';

const mapStateToProps = state => {
  return {
    template: state.template.current,
    currentState: state.template.currentState
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({newTemplate, openTemplate, saveTemplate, changeTemplateGen}, dispatch);
}

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
      templateid: "",
      tabValue: "G",
      applications: [],
    };
  }

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleChange = prop => event => {
    this.props.changeTemplateGen(prop, event.target.value);
  };

  handleOnSubmit = e => {
    e.preventDefault();
    if (this.props.match.params.id!=='') {
      apiCall.update( '/templates/', this.props.match.params.id, this.props.template, this.handleUpdate.bind(this) );
    } else {
      apiCall.create('/templates', this.props.template, this.handleUpdate.bind(this) );
    }
  }

  handleUpdate(result, data) {
    if (result) {
      this.getData(data.id);
    } else {
      // Handle result
    }
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.openTemplate(this.props.match.params.id);
    } else {
      this.props.newTemplate();
    }
  }

  render() {
    const { classes, theme, template, currentState } = this.props;
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
               <Grid container spacing={Number(24)}>
                 <Grid item xs={8}>
                   <TextField id="name" label="name" fullWidth margin="normal" variant="outlined"
                     className={classes.textField} value={template.name} onChange={this.handleChange("name")}
                   />
                 </Grid>
                 <Grid item xs={4}>
                   <TextField id="version" label="version" fullWidth margin="normal" variant="outlined"
                     className={classes.textField} value={template.version} InputProps={{ readOnly: true }}
                   />
                 </Grid>
                 <Grid item xs={12}>
                   <TextField id="description" multiline label="description" fullWidth margin="normal" variant="outlined"
                     className={classes.textField} value={template.description} onChange={this.handleChange("description")}
                   />
                 </Grid>
               </Grid>
             </TabContainer>}
           {tabValue === "A" &&
             <TabContainer>
               <Grid container>
                 <FlowAuth flowauth={template.canstart} />
               </Grid>
             </TabContainer>}
             {tabValue === "D" &&
               <TabContainer>
                 <Grid container>
                   <FlowData flowdata={template.data} />
                 </Grid>
               </TabContainer>}
           {tabValue === "F" &&
             <TabContainer>
               <Grid container>
                 <FlowDefinition
                  currentState={currentState}
                  flowTemplate={template} />
               </Grid>
             </TabContainer>}
          <Grid container justify="flex-end">
            <Button variant="contained" aria-label="Add" color="primary" className={classes.button} onClick={this.handleOnSubmit} >
              Save definition
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

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(Template));
