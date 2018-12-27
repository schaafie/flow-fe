import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import classNames from "classnames";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InboxIcon from "@material-ui/icons/MoveToInbox";
import GroupIcon from "@material-ui/icons/Group";
import RoleIcon from "@material-ui/icons/HowToReg";
import ActionIcon from "@material-ui/icons/Security";
import ApplicationIcon from "@material-ui/icons/WebAsset";

import basicAuth from '../Auth/basicAuth.js';
import LogoutLink from '../Auth/logout.js';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  }
});

class Mainmenu extends Component {

  state = {
    expanded: 'panel1',
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
        expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div>
        {basicAuth.isAuthenticated && (
          <div>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>User Management</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <List>
                  <ListItem button key="users" component={Link} to="/users">
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                  </ListItem>
                  <ListItem button key="roles" component={Link} to="/roles">
                    <ListItemIcon>
                      <RoleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Roles" />
                  </ListItem>
                  <ListItem button key="actions" component={Link} to="/actions">
                    <ListItemIcon>
                      <ActionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Actions" />
                  </ListItem>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Administration</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <List>
                  <ListItem button key="applications" component={Link} to="/applications">
                    <ListItemIcon>
                      <ApplicationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Applications" />
                  </ListItem>
                  <ListItem button key="templates" component={Link} to="/templates">
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="Templates" />
                  </ListItem>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
      )}
      </div>
    );
  }
}

Mainmenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Mainmenu);
