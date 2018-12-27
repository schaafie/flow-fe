import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/Create";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";

// CSS + Styles Part
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
  },
  root: {
    padding: 0,
    paddingLeft: 4
  }
}))(TableCell);

const styles = theme => ({
  table: {
    minWidth: 500
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
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

// Class Part

class FlowData extends Component {
  constructor() {
    super();
    this.state = {
      new_name: '',
      new_type: '',
      new_format: '',
      new_default: '',
      edit_name: '',
      edit_type: '',
      edit_format: '',
      edit_default: '',
      edit_id: 0
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleAdd = event => {
    this.props.addData(
      this.state.new_name,
      this.state.new_type,
      this.state.new_format,
      this.state.new_default
    );

    this.setState({
      new_name: '',
      new_type: '',
      new_format: '',
      new_default: ''
    });

    event.preventDefault();
  }

  handleEdit = item => event => {
    event.preventDefault();
    this.setState({
      edit_name: item.name,
      edit_type: item.type,
      edit_format: item.format,
      edit_default: item.default,
      edit_id: item.id
    });
  }

  handleCancel = event => {
    event.preventDefault();
    this.setState({ edit_id: 0 });
  }

  handleSave = event => {
    event.preventDefault();
    this.props.changeData(
      this.state.edit_id,
      this.state.edit_name,
      this.state.edit_type,
      this.state.edit_format,
      this.state.edit_default
    );
    this.setState({ edit_id: 0 });
  }

  handleDelete = id => event => {
    event.preventDefault();
    this.props.removeData(id);
  }

  render() {
    const { classes } = this.props;

    return (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Name</CustomTableCell>
              <CustomTableCell>Type</CustomTableCell>
              <CustomTableCell>Format</CustomTableCell>
              <CustomTableCell>Default</CustomTableCell>
              <CustomTableCell>Action</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.flowdata.map((item,key) => {
              return (item.id!==this.state.edit_id) ?
              <TableRow className={classes.row} key={key}>
                <CustomTableCell>{item.name}</CustomTableCell>
                <CustomTableCell>{item.type}</CustomTableCell>
                <CustomTableCell>{item.format}</CustomTableCell>
                <CustomTableCell>{item.default}</CustomTableCell>
                <CustomTableCell>
                  <IconButton variant="contained" color="primary"
                    className={classes.button} onClick={this.handleEdit(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton variant="contained" color="secondary"
                    className={classes.button} onClick={this.handleDelete(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CustomTableCell>
              </TableRow>
              :
              <TableRow className={classes.row} key={key}>
                <CustomTableCell>
                  <TextField id="edit_name" margin="normal" variant="outlined"
                    className={classes.textField} value={this.state.edit_name}
                    onChange={this.handleChange("edit_name")} />
                </CustomTableCell>
                <CustomTableCell>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <Select native value={this.state.edit_type}
                      onChange={this.handleChange('edit_type')}
                      input={<OutlinedInput name="edit_type" id="edit_type" />} >
                      <option value="" />
                      <option value="string">String</option>
                      <option value="integer">Integer</option>
                      <option value="decimal">Decimal</option>
                      <option value="list">List</option>
                      <option value="boolean">Boolean</option>
                      <option value="binairy">Binairy</option>
                    </Select>
                  </FormControl>
                </CustomTableCell>
                <CustomTableCell>
                  <TextField id="edit_format" margin="normal" variant="outlined"
                    className={classes.textField} value={this.state.edit_format}
                    onChange={this.handleChange("edit_format")} />
                </CustomTableCell>
                <CustomTableCell>
                  <TextField id="edit_default" margin="normal" variant="outlined"
                    className={classes.textField} value={this.state.edit_default}
                    onChange={this.handleChange("edit_default")} />
                </CustomTableCell>
                <CustomTableCell>
                  <IconButton variant="contained" color="primary"
                    className={classes.button} onClick={this.handleSave}>
                    <SaveIcon fontSize="small" />
                  </IconButton>
                  <IconButton variant="contained" color="secondary"
                    className={classes.button} onClick={this.handleCancel}>
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </CustomTableCell>
              </TableRow>
            }, this)}
          </TableBody>
          {this.state.edit_id===0 &&
          <TableFooter>
            <TableRow className={classes.row}>
              <CustomTableCell>
                <TextField id="new_name" margin="normal" variant="outlined"
                  className={classes.textField} value={this.state.new_name}
                  onChange={this.handleChange("new_name")} />
              </CustomTableCell>
              <CustomTableCell>
                <FormControl variant="outlined" className={classes.formControl}>
                  <Select native value={this.state.new_type}
                    onChange={this.handleChange('new_type')}
                    input={<OutlinedInput name="new_type" id="new_type" />} >
                    <option value="" />
                    <option value="string">String</option>
                    <option value="integer">Integer</option>
                    <option value="decimal">Decimal</option>
                    <option value="list">List</option>
                    <option value="boolean">Boolean</option>
                    <option value="binairy">Binairy</option>
                  </Select>
                </FormControl>
              </CustomTableCell>
              <CustomTableCell>
                <TextField id="new_format" margin="normal" variant="outlined"
                  className={classes.textField} value={this.state.new_format}
                  onChange={this.handleChange("new_format")} />
              </CustomTableCell>
              <CustomTableCell>
                <TextField id="new_default" margin="normal" variant="outlined"
                  className={classes.textField} value={this.state.new_default}
                  onChange={this.handleChange("new_default")} />
              </CustomTableCell>
              <CustomTableCell>
                <Button variant="contained"
                  className={classes.button}
                  onClick={this.handleAdd.bind(this)} >
                  <AddIcon fontSize="small"/> Add
                </Button>
              </CustomTableCell>
            </TableRow>
          </TableFooter>
        }
        </Table>
    );
  }
}

FlowData.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlowData);
