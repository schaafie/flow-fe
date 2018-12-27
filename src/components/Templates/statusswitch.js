import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
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

class StatusSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flip: this.flip.bind(this)
    };
  }

  flip() {
    this.props.flipSwitch( this.props.type, this.props.id );
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <Switch
        classes={{
          switchBase: classes.iOSSwitchBase,
          bar: classes.iOSBar,
          icon: classes.iOSIcon,
          iconChecked: classes.iOSIconChecked,
          checked: classes.iOSChecked
        }}
        disableRipple
        checked={this.props.status}
        onChange={this.state.flip}
      />
    );
  }
}

StatusSwitch.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StatusSwitch);
