import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import basicAuth from './basicAuth.js';
import { withRouter } from "react-router-dom";

class ProfileMenu extends React.Component {
  state = {
    open: false,
    auth: true,
    anchorEl: null
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const LogoutLink = withRouter(
      ({ history }) => (
        <MenuItem onClick={
          () => {
            this.handleClose();
            basicAuth.signout(() => history.push("/login"));
          }
        }>
          Sign out
        </MenuItem>
      )
    );

    return (
      <div>
        {auth && (
          <div>
            <IconButton
              aria-owns={open ? "menu-appbar" : undefined}
              aria-haspopup="true"
              onClick={this.handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={open}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleClose}>Profile</MenuItem>
              <MenuItem><LogoutLink /></MenuItem>
            </Menu>
          </div>
        )}
      </div>
    );
  }
}

export default ProfileMenu;
