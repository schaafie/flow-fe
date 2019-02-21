import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { newTemplate, openTemplate, saveTemplate, updateTemplate, changeTemplateGen } from '../../redux/actions.js';

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
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FlowDefinition from "./flowdefinition";
import FlowAuth from './flowauth.js';
import FlowData from './flowdata.js';
import SaveIcon from '@material-ui/icons/Save';

const mapStateToProps = state => {
  return {
    template: state.template.current,
    currentState: state.template.currentState,
    currentid: state.template.currentid
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {newTemplate, openTemplate, saveTemplate, updateTemplate, changeTemplateGen}
    , dispatch);
}

const sdActions = [
  { label: 'x.0.0', icon: <SaveIcon />, name: 'Major' },
  { label: '.x.0', icon: <SaveIcon />, name: 'Medior' },
  { label: '..x', icon: <SaveIcon />, name: 'Minor' },
];

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
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
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

class Template extends Component {
  constructor() {
    super();
    this.state = {
      sdopen: false,
      templateid: "",
      tabValue: "G",
      applications: []
    };
  }

  handleSDClick = event => {
    this.setState(state => ({
      sdopen: !state.sdopen,
    }));
  };

  buildNewVersion = (version,type) => {
    let parts = version.split('.');
    let vparts = parts.map(function(item,index){return (!isNaN(item))?Number(item):0;});
    if (vparts.length<3) {vparts.push(0);}
    switch(type) {
      case 'Major':
        return (vparts[0]+1)+".0";
      case 'Medior':
        return vparts[0]+"."+(vparts[1]+1);
      case 'Minor':
        return vparts[0]+"."+vparts[1]+"."+(vparts[2]+1);
      default:
        return version;
    }
  }

  handleSaveClick = (type) => {
    let cversion = this.props.template.version;
    let nversion = this.buildNewVersion(cversion, type);
    if (cversion===nversion && !this.props.currentid) {
      this.props.updateTemplate(this.props.currentid, this.props.template);
    } else {
      this.props.changeTemplateGen('version', nversion);
      this.props.saveTemplate();
    }
  }

  handleSDClose = () => {
    this.setState({ sdopen: false });
  };

  handleSDOpen = () => {
    this.setState({ sdopen: true });
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleChange = prop => event => {
    this.props.changeTemplateGen(prop, event.target.value);
  };

  componentWillMount() {
    if (this.props.match.params.id) {
      this.props.openTemplate(this.props.match.params.id);
    } else {
      this.props.newTemplate();
    }
  }

  render() {
    const { classes, theme, template, currentState } = this.props;
    const { tabValue, sdopen } = this.state;

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
                     className={classes.textField} value={template.version} InputProps={{readOnly:true}}
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
                   <FlowData flowdata={template.flow.data} />
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
            <SpeedDial
              ariaLabel="SpeedDial template"
              className={classes.speedDial}
              hidden={false}
              icon={<SaveIcon />}
              onBlur={this.handleSDClose}
              onClick={this.handleSDClick}
              onClose={this.handleSDClose}
              onFocus={this.handleSDOpen}
              onMouseEnter={this.handleSDOpen}
              onMouseLeave={this.handleSDClose}
              open={sdopen}
              direction='up'
            >
              {sdActions.map(action => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.label}
                  tooltipOpen
                  tooltipTitle={action.name}
                  onClick={this.handleSaveClick.bind(this,action.name)}
                />
              ))}
            </SpeedDial>
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
