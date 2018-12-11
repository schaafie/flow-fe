import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
// Material-UI Components
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// Additional objects
import basicAuth from "./basicAuth.js";

class Login extends Component {

  constructor() {
    super();

    this.state = {
      redirectToReferrer: false,
      login: '',
      password: '',
      showPassword: false,
    };
  };

  handleOnSubmit = e => {
    e.preventDefault();
    const { login, password } = this.state;
    basicAuth.authenticate( login, password, () => {
      this.setState({ redirectToReferrer: true });
    });
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {

    return (
      <Dialog open={!basicAuth.isAuthenticated} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
        <DialogContentText>
          To use the application, please login.
        </DialogContentText>
        <TextField id="login" type="text" label="Login" fullWidth
          value={this.state.login}
          onChange={this.handleChange("login")} />
        <TextField id="password" label="Password" fullWidth
          type={this.state.showPassword ? "text" : "password"}
          value={this.state.password}
          onChange={this.handleChange("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment variant="filled" position="end">
              <IconButton aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleOnSubmit} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Login;
