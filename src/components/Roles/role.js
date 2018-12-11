import React, { Component } from 'react';
import apiCall from "../Api/apiCall.js";
import RoleAction from "./RoleAction.js";
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


class Role extends Component {

  constructor() {
    super();
    this.state = {
      roleid: '',
      name: '',
      description: '',
      roleactions: []
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleOnSubmit = e => {
    e.preventDefault();
    const { roleid, name, description } = this.state;

    let data = { role: { name: name, description: description } }
    if (roleid!=='') {
      apiCall.update( '/roles/', roleid, data, this.handleUpdate.bind(this) );
    } else {
      apiCall.create('/roles', data, this.handleUpdate.bind(this) );
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
        roleid: data.id,
        name: data.name,
        description: data.description,
        roleactions: data.roleactions,
      });
    } else {
      // Handle error
    }
  }

  getData(id) {
    apiCall.getItem( '/roles/', id, this.handleGetItem.bind(this) );
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getData(this.props.match.params.id);
    }
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div>
        <Paper className={classes.root}>
          <Typography variant="h6" color="inherit" className={classes.header}>
            Role details
          </Typography>
          <TextField id="name" type="text" label="name" fullWidth margin="normal" variant="outlined"
            className={classes.textField} value={this.state.name} onChange={this.handleChange("name")}
          />
          <TextField id="description" type="text" label="description" fullWidth margin="normal" variant="outlined"
            className={classes.textField} value={this.state.description} onChange={this.handleChange("description")}
          />
          <Grid container justify="flex-end">
            <Button variant="contained" aria-label="Add" color="primary" className={classes.button} onClick={this.handleOnSubmit} >
              Save
            </Button>
          </Grid>
        </Paper>
        {this.state.roleid &&
          <Paper className={classes.root}>
            <Typography variant="h6" color="inherit" className={classes.header}>
              Actions
            </Typography>
            <Grid container>
              {this.state.roleactions.map((item,key) => (
                <RoleAction
                  actionname = {item.actionname}
                  authorisationid = {item.authorisationid}
                  roleid = {item.roleid}
                  actionid = {item.actionid}
                  status = {item.authorisationid>0} />
              ))}
            </Grid>
          </Paper>
        }
      </div>
    );
  }
}

Role.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Role);
