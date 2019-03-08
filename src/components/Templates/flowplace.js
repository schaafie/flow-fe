import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTemplatePlace,
         addTemplateConnection,
         changeTemplateConnection,
         deleteTemplateConnection } from '../../redux/actions.js';

import classNames from "classnames";
import PropTypes from "prop-types";
import FlowActionApplication from "./flowactionappl.js"

import { withStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import grey from '@material-ui/core/colors/grey';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ changeTemplatePlace }, dispatch);
}

const styles = theme => ({
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
  textField: {
    marginRight: theme.spacing.unit
  },
  targetSelect: {
    margin: theme.spacing.unit,
    backgroundColor: grey[100]
  },
  select: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class FlowPlace extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
  }

  handleChange = name => event => {
    this.props.changeTemplatePlace( this.props.currentPlace, name, event.target.value);
  };

  getCurrentPlace = (ft, currentPlace) => {
    let place = {};
    ft.flow.places.map(function(item,index){
      if (item.place.id===currentPlace) {
        place = ft.flow.places[index];
      }
    })
    return place;
  }

  render() {
    const { classes, theme, flowTemplate, currentPlace } = this.props;
    const { tabValue } = this.state;

    const item = this.getCurrentPlace(flowTemplate, currentPlace);
    const connections = flowTemplate.flow.connections;

    return (
      <div>
        { item.place.type==="start" &&
          <p>start point</p>
        }
        { item.place.type==="place" &&
        <div>
          <Grid container>
            <Grid item xs={12}>
              <TextField id="name"
                label="name"
                fullWidth
                margin="normal"
                variant="outlined"
                className={classes.textField}
                value={item.place.name}
                onChange={this.handleChange("name")} />
            </Grid>
          </Grid>
        </div>
      }
    </div>
    );
  }
}

FlowPlace.propTypes = { classes: PropTypes.object.isRequired };
export default withStyles(styles)(connect(null,mapDispatchToProps)(FlowPlace));
