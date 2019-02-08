import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTemplateObject, addTemplateObject,
         deleteTemplateObject, changeTemplateObject,
         addTemplateTerminator, changeTemplateTerminator,
         deleteTemplateTerminator, addTemplateConnection,
         deleteTemplateConnection } from '../../redux/actions.js';

import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FlowAction from './flowaction.js';
import FlowView from './flowview.js';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ addTemplateObject, addTemplateTerminator }, dispatch);
}

const styles = theme => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class FlowDefinition extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  addConnection(origin, direction, target) {
    let to = (direction=='output')?target:origin;
    let from = (direction=='output')?origin:target;
    this.props.addTemplateConnection(to,from);
  }

  render() {
    const { classes, state, currentState, flowTemplate } = this.props;

    return(
      <Grid container>
        <Grid item xs={8}>
          <FlowView/>
        </Grid>
        <Grid item xs={4}>
          <Paper>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  onClick={this.props.addTemplateObject}
                  className={classes.menuButton}
                  color="inherit" aria-label="Add action">
                  <AddIcon />
                </IconButton>
                {currentState!==false &&
                  <IconButton
                    className={classes.menuButton}
                    color="inherit" aria-label="Clone">
                    <FileCopyIcon />
                  </IconButton>
                }
              </Toolbar>
            </AppBar>
            {currentState===false &&
              <div>No item selected</div>
            }
            {currentState!==false &&
              <FlowAction flowTemplate={flowTemplate} currentState={currentState} />
            }
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

FlowDefinition.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(null,mapDispatchToProps)(FlowDefinition));
