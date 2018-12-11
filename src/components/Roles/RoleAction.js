import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import apiCall from "../Api/apiCall.js";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";

const scrapcolor = grey["200"]; // #E040FB

const styles = theme => ({
  scrap: {
    backgroundColor: scrapcolor,
    margin: theme.spacing.unit
  },
  iOSSwitchBase: {
    "&$iOSChecked": {
      color: theme.palette.common.white,
      "& + $iOSBar": {
        backgroundColor: "#52d869"
      }
    },
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp
    })
  },
  iOSChecked: {
    transform: "translateX(15px)",
    "& + $iOSBar": {
      opacity: 1,
      border: "none"
    }
  },
  iOSBar: {
    borderRadius: 13,
    width: 42,
    height: 26,
    marginTop: -13,
    marginLeft: -21,
    border: "solid 1px",
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"])
  },
  iOSIcon: {
    width: 24,
    height: 24
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1]
  }
});

class RoleAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionname: props.actionname,
      authorisationid: props.authorisationid,
      actionid: props.actionid,
      roleid: props.roleid,
      status: props.status
    };
  }

  handleChange = event => {
    if (this.state.authorisationid>0) {
      apiCall.delete(this.state.authorisationid,'/authorisations/',this.handleDelete.bind(this) );
    } else {
      let data = { authorisation: { action: this.state.actionid, role: this.state.roleid }};
      apiCall.create('/authorisations', data, this.updateState.bind(this) );
    }
  };

  handleDelete(result, data) {
    if (result) {
      this.updateState(false, []);
    } else {
      // Handle fail
    }
  }

  updateState(result, data) {
    console.log(data);
    if (result) {
      this.setState({
        authorisationid: data.id,
        status: true
      });
    } else {
      this.setState({
        authorisationid: 0,
        status: false
      });
    }
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <Grid xs={4}>
        <Paper className={classes.scrap}>
          <Grid container alignItems="center">
            <Grid xs={8} align="center">
              <Typography variant="body2" color="inherit">
                {this.state.actionname}
              </Typography>
            </Grid>
            <Grid xs={4}>
              <Switch
                classes={{
                  switchBase: classes.iOSSwitchBase,
                  bar: classes.iOSBar,
                  icon: classes.iOSIcon,
                  iconChecked: classes.iOSIconChecked,
                  checked: classes.iOSChecked
                }}
                disableRipple
                checked={this.state.status}
                onChange={this.handleChange}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

RoleAction.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RoleAction);
