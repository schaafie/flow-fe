import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import basicAuth from './Auth/basicAuth.js';
import Login from './Auth/login.js';
import ProfileMenu from "./Auth/profilemenu.js";
import Main from './Main/main.js';
import Mainmenu from './Menu/mainmenu.js';
import Users from './Users/users.js';
import User from './Users/user.js';
import Roles from './Roles/roles.js';
import Role from './Roles/role.js';
import Actions from './Actions/actions.js';
import Action from './Actions/action.js';
import Templates from './Templates/templates.js';
import Template from './Templates/template.js';
// -----------------------
// CSS The Material-UI way
// -----------------------
const drawerWidth = 240;
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

class App extends React.Component {
  state = { open: false };
  handleDrawerOpen = () => { this.setState({ open: true }); };
  handleDrawerClose = () => { this.setState({ open: false }); };

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;

    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classNames(classes.appBar, { [classes.appBarShift]: open })} >
            <Toolbar disableGutters={!open}>
              <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerOpen} className={classNames(classes.menuButton, open && classes.hide)} >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Flow
              </Typography>
              <ProfileMenu />
            </Toolbar>
          </AppBar>
          <Drawer className={classes.drawer} variant="persistent" anchor="left" open={open} classes={{ paper: classes.drawerPaper }} >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <Mainmenu />
          </Drawer>
          <main className={classNames(classes.content, { [classes.contentShift]: open })} >
            <div className={classes.drawerHeader} />
                <Switch>
                  <PrivateRoute path="/users/:id" component={User} />
                  <PrivateRoute path="/users" component={Users} />
                  <PrivateRoute path="/user" component={User} />
                  <PrivateRoute path="/roles/:id" component={Role} />
                  <PrivateRoute path="/roles" component={Roles} />
                  <PrivateRoute path="/role" component={Role} />
                  <PrivateRoute path="/actions/:id" component={Action} />
                  <PrivateRoute path="/actions" component={Actions} />
                  <PrivateRoute path="/action" component={Action} />
                  <PrivateRoute path="/templates/:id" component={Template} />
                  <PrivateRoute path="/templates" component={Templates} />
                  <PrivateRoute path="/template" component={Template} />
                  <PrivateRoute path="/signout" component={Login} />
                  <Route path="/" component={Main} />
                </Switch>
          </main>
          <Login />
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props =>
    basicAuth.isAuthenticated
     ? <Component {...props} />
     : <Redirect to={{ pathname: "/", state: { from: props.location } }} />
  } />
);


App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
