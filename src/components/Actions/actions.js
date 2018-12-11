import React, { Component } from 'react';
import apiCall from "../Api/apiCall.js";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

// CSS + Styles Part
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    paddingBottom: theme.spacing.unit * 2
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  button: {
    margin: theme.spacing.unit
  },
  extendedButton: {
    margin: theme.spacing.unit
  }
});

// Class Part

class Actions extends Component {
  constructor() {
    super();
    this.state = {
      items: []
    };
  }

  getItems() {
    apiCall.getlist( '/actions', this.handleGetItems.bind(this) );
  }

  handleGetItems( result, data ) {
    if (result) {
      this.setState({ items: data })
    } else {
        // Handle error
    }
  }

  componentWillMount() {
    this.getItems(this);
  }

  deleteAction = item => event => {
    apiCall.delete( item.id, '/actions/', this.handleDelete.bind(this) );
  }

  handleDelete( result, data ) {
    if (result) {
      this.getItems();
    } else {
        // Handle error
    }
  }

  editAction = item => event => {
    this.props.history.push('/actions/'+item.id);
  }

  addAction = () => {
    this.props.history.push('/action');
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Id</CustomTableCell>
              <CustomTableCell>Method</CustomTableCell>
              <CustomTableCell>URL</CustomTableCell>
              <CustomTableCell>Actions</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.items.map((item,key) => (
              <TableRow className={classes.row} key={key}>
                <CustomTableCell>
                  {item.id}
                </CustomTableCell>
                <CustomTableCell>
                  {item.method}
                </CustomTableCell>
                <CustomTableCell>
                  {item.url}
                </CustomTableCell>
                <CustomTableCell>
                  <IconButton aria-label="Edit" className={classes.button} onClick={this.editAction(item)}>
                    <CreateIcon />
                  </IconButton>
                  <IconButton aria-label="Delete" className={classes.button} onClick={this.deleteAction(item)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Grid container justify="flex-end">
          <Button variant="contained" aria-label="Add" color="primary" className={classes.extendedButton} onClick={this.addAction} >
            <AddIcon /> Add Action
          </Button>
        </Grid>
      </Paper>
    );
  }
}

Actions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Actions);
