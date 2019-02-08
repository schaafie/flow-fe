import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { flipTemplateAuth } from '../../redux/actions.js';

import apiCall from "../Api/apiCall.js";
import StatusSwitch from "./statusswitch.js";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const mapDispatchToProps = dispatch => {
  return bindActionCreators({flipTemplateAuth}, dispatch);
}

// CSS + Styles Part
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 12
  }
}))(TableCell);

const styles = theme => ({
  header: {
    paddingBottom: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflowX: "auto"
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

class Flowauth extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      roles: [],
      getStatus: this.getStatus.bind(this),
      flipSwitch: this.flipTemplateAuth.bind(this)
    };
  }

  flipTemplateAuth(type,id) {
    this.props.flipTemplateAuth(id,type);
  }

  getStatus(type, id) {
    if (type==='users') {
      return this.props.flowauth.users.includes(id);
    } else if (type==='roles') {
      return this.props.flowauth.roles.includes(id);
    }
  }

  handleGetUsers( result, data ) {
    if (result) {
      this.setState({ users: data });
    } else {
      // Handle error
    }
  }

  handleGetRoles( result, data ) {
    if (result) {
      this.setState({ roles: data });
    } else {
      // Handle error
    }
  }

  componentWillMount() {
    console.log("check # occurences... once per edit template");
    apiCall.getlist( '/users', this.handleGetUsers.bind(this) );
    apiCall.getlist( '/roles', this.handleGetRoles.bind(this) );
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <Grid container spacing={Number(16)}>
        <Grid item xs={6} >
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell>Users</CustomTableCell>
                <CustomTableCell></CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {this.state.users.map((item,key) => (
              <TableRow className={classes.row} key={key}>
                <CustomTableCell>{item.login}</CustomTableCell>
                <CustomTableCell>
                  <StatusSwitch
                    type = 'users'
                    id = {item.id}
                    flipSwitch = {this.state.flipSwitch}
                    status = {this.state.getStatus('users',item.id)}
                  />
                </CustomTableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={6}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell>Roles</CustomTableCell>
                <CustomTableCell></CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.roles.map((item,key) => (
                <TableRow className={classes.row} key={key}>
                  <CustomTableCell>{item.name}</CustomTableCell>
                  <CustomTableCell>
                    <StatusSwitch
                      type = 'roles'
                      id = {item.id}
                      flipSwitch = {this.state.flipSwitch}
                      status = {this.state.getStatus('roles',item.id)}
                    />
                  </CustomTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

Flowauth.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(null,mapDispatchToProps)(Flowauth));
