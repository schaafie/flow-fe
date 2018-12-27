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
import FlowDefinition from "./flowdefinition";
import FlowAuth from './flowauth.js';
import FlowData from './flowdata.js';
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
      can_start: {users:[],roles:[]},
      current: false,
      flowstates: templatejson.flow.flow,
      flowdata: templatejson.flow.data,
      applications: []
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleOnSubmit = e => {
    e.preventDefault();
    const { templateid, name, version, description, can_start, current, flowstates, flowdata } = this.state;

    let data = {
      template: {
        name: name,
        version: version,
        description: description,
        can_start: can_start,
        current: current,
        definition: { data: flowdata, flow: flowstates }
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

  persistStates(flow) {
    this.setState({flowstates: flow});
  }

  updateList(list,id) {
    let index = list.indexOf(id);
    if (index===-1) {
      list.push(id);
      return list;
    }
    list.splice(index,1);
    return list;
  }

  flipAuth(type, id) {
    switch(type) {
      case 'users':
        this.setState({ can_start: {
          users: this.updateList(this.state.can_start.users,id),
          roles: this.state.can_start.roles
        }});
        break;
      case 'roles':
        this.setState({ can_start: {
          users: this.state.can_start.users,
          roles: this.updateList(this.state.can_start.roles,id)
        }});
        break;
    }
  }

  addData(name, type, format, def) {
    let data = this.state.flowdata;
    let maxId = 0;
    data.forEach(function(item){ if (item.id>maxId) {maxId=item.id} })
    data.push({
      id: maxId+1,
      name: name,
      type: type,
      format: format,
      default: def
    });

    this.setState({flowdata: data});
  }

  removeData(dataid) {
    let data = this.state.flowdata;
    data.map((item,index) => {
      if(item.id===dataid) {
        data.splice(index,1);
        return true;
      }
    })
    this.setState({flowdata: data});
  }

  changeData(id, name, type, format, def) {
    let data = this.state.flowdata;
    data.map((item,index) => {
      if(item.id===id) {
        data[index].name = name;
        data[index].type = type;
        data[index].format = format;
        data[index].default = def;
        return true;
      }
    });
    this.setState({flowdata: data});
  }

  addFlowData() {
    let data = this.state.flowdata;
    this.setState({flowdata: data});
  }

  setApplication(itemId, appId) {
    // loop items and add app
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
        definiton: { data: data.data, flow: data.flow }
      });
    } else {
      // Handle error
    }
  }

  handleGetApps( result, data ) {
    if (result) {
      this.setState({ applications: data })
    } else {
        // Handle error
    }
  }

  getData(id) {
    apiCall.getItem( '/templates/', id, this.handleGetItem.bind(this) );
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getData(this.props.match.params.id);
    }
    apiCall.getlist( '/applications', this.handleGetApps.bind(this) );
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
               <Grid container spacing={Number(24)}>
                 <Grid item xs={8}>
                   <TextField id="name" label="name" fullWidth margin="normal" variant="outlined"
                     className={classes.textField} value={this.state.name} onChange={this.handleChange("name")}
                   />
                 </Grid>
                 <Grid item xs={4}>
                   <TextField id="version" label="version" fullWidth margin="normal" variant="outlined"
                     className={classes.textField} value={this.state.version} InputProps={{ readOnly: true }}
                   />
                 </Grid>
                 <Grid item xs={12}>
                   <TextField id="description" multiline label="description" fullWidth margin="normal" variant="outlined"
                     className={classes.textField} value={this.state.description} onChange={this.handleChange("description")}
                   />
                 </Grid>
               </Grid>
             </TabContainer>}
           {tabValue === "A" &&
             <TabContainer>
               <Grid container>
                 <FlowAuth
                   flowauth={this.state.can_start}
                   flipAuth={this.flipAuth.bind(this)}
                  />
               </Grid>
             </TabContainer>}
             {tabValue === "D" &&
               <TabContainer>
                 <Grid container>
                   <FlowData
                     flowdata={this.state.flowdata}
                     addData={this.addData.bind(this)}
                     removeData={this.removeData.bind(this)}
                     changeData={this.changeData.bind(this)}
                    />
                 </Grid>
               </TabContainer>}
           {tabValue === "F" &&
             <TabContainer>
               <Grid container>
                 <FlowDefinition
                   flowstates={this.state.flowstates}
                   flowdata={this.state.flowdata}
                   applications={this.state.applications}
                   setApplication={this.setApplication.bind(this)}
                   addData={this.addFlowData.bind(this)}
                   persistStates={this.persistStates.bind(this)}
                  />
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

export default withStyles(styles)(Template);
