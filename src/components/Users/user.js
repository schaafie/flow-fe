import React, { Component } from 'react';
import apiCall from "../Api/apiCall.js";
import UserRole from "./UserRole.js";
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


class User extends Component {

  constructor() {
    super();
    this.state = {
      userid: '',
      login: '',
      email: '',
      password: '',
      password2: '',
      userroles: [],
      showPassword: false,
      showPassword2: false
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleOnSubmit = e => {
    e.preventDefault();
    const { userid, login, email, password, password2 } = this.state;

    let data = { user: { login: login, email: email, password: password, password_confirmation: password2 } }
    if (userid!=='') {
      apiCall.update( '/users/', userid, data, this.handleUpdate.bind(this) );
    } else {
      apiCall.create('/users', data, this.handleUpdate.bind(this) );
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
        userid: data.id,
        login: data.login,
        email: data.email,
        password: data.password,
        password2: data.password_confirmation,
        userroles: data.userroles,
      });
    } else {
      // Handle error
    }
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleClickShowPassword2 = () => {
    this.setState({ showPassword2: !this.state.showPassword2 });
  };

  getData(id) {
    apiCall.getItem( '/users/', id, this.handleGetItem.bind(this) );
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
            User details
          </Typography>
          <TextField id="login" type="text" label="Login" fullWidth margin="normal" variant="outlined"
            className={classes.textField} value={this.state.login} onChange={this.handleChange("login")}
          />
          <TextField id="email" type="email" label="email" fullWidth margin="normal" variant="outlined"
            className={classes.textField} value={this.state.email} onChange={this.handleChange("email")}
          />
          <TextField id="password" label="Password" margin="normal" variant="outlined" fullWidth
            className={classes.textField} type={this.state.showPassword ? "text" : "password"}
            value={this.state.password} onChange={this.handleChange("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment variant="filled" position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword} >
                    {this.state.showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField id="password2" label="Password2" margin="normal" variant="outlined" fullWidth
            className={classes.textField} type={this.state.showPassword2 ? "text" : "password"}
            value={this.state.password2} onChange={this.handleChange("password2")}
            InputProps={{
              endAdornment: (
                <InputAdornment variant="filled" position="end">
                  <IconButton aria-label="Toggle password2 visibility" onClick={this.handleClickShowPassword2} >
                    {this.state.showPassword2 ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Grid container justify="flex-end">
            <Button variant="contained" aria-label="Add" color="primary" className={classes.button} onClick={this.handleOnSubmit} >
              Save
            </Button>
          </Grid>
        </Paper>
        {this.state.userid &&
          <Paper className={classes.root}>
            <Typography variant="h6" color="inherit" className={classes.header}>
              Roles
            </Typography>
            <Grid container>
              {this.state.userroles.map((item,key) => (
                <UserRole
                  rolename = {item.rolename}
                  memberid = {item.memberid}
                  userid = {item.userid}
                  roleid = {item.roleid}
                  status = {item.memberid>0} />
              ))}
            </Grid>
          </Paper>
        }
      </div>
    );
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(User);
