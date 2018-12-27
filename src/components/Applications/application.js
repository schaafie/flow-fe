import React, { Component } from 'react';
import apiCall from "../Api/apiCall.js";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/Create";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

// CSS + Styles Part
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
//    fontSize: 14
  },
  root: {
    padding: 0,
    paddingLeft: 4
  }
}))(TableCell);

const styles = theme => ({
  textField: {
//    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
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
  button: {
//    margin: theme.spacing.unit
  },
  header: {
    paddingBottom: theme.spacing.unit
  },
  formControl: {
    paddingTop: 8
  }
});


class Application extends Component {

  constructor() {
    super();
    this.state = {
      id: 0,
      name: '',
      version: '',
      description: '',
      definition: { system:'', module:'', call:'', data:[] },
      edit_id: 0,
      new_name: '',
      new_type: '',
      new_inout: '',
      new_format: '',
      new_default: '',
      edit_name: '',
      edit_type: '',
      edit_inout: '',
      edit_format: '',
      edit_default: ''
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleDefChange = prop => event => {
    let def = this.state.definition;
    switch(prop) {
      case 'system':
        def.system = event.target.value;
        break;
      case 'module':
        def.module = event.target.value;
        break;
      case 'call':
        def.call = event.target.value;
        break;

    }
    this.setState({ definition: def });
  }

  handleAddData = event => {
    let def = this.state.definition;
    let ddata = def.data;
    let did = 0;
    ddata.forEach((item,index) =>{
      if(item.id>did) {did = item.id;}
    });

    ddata.push({
      id: did+1,
      name: this.state.new_name,
      type: this.state.new_type,
      inout: this.state.new_inout,
      format: this.state.new_format,
      default: this.state.new_default
    });
    def.data = ddata;

    this.setState({
      new_name: '',
      new_type: '',
      new_format: '',
      new_inout: '',
      new_default: '',
      definition: def
    });
  }

  handleEditData = item => event => {
    this.setState({
      edit_name: item.name,
      edit_type: item.type,
      edit_inout: item.inout,
      edit_format: item.format,
      edit_default: item.default,
      edit_id: item.id
    });
  }

  handleCancelData = event => {
    this.setState({ edit_id: 0 });
  }

  handleSaveData = event => {
    let def = this.state.definition;
    def.data.map((item,index) => {
      if (item.id===this.state.edit_id) {
        def.data[index] = {
          id: item.id,
          name: this.state.edit_name,
          type: this.state.edit_type,
          inout: this.state.edit_inout,
          format: this.state.edit_format,
          default: this.state.edit_default
        }
        this.setState({
          definition: def,
          edit_id: 0
        });
        return true;
      }
    }, this);
  }

  handleDeleteData = item => event => {
    let def = this.state.definition;
    def.data.map((dataitem,index) => {
      if (dataitem.id===item.id) {
        def.data.splice(index,1);
        this.setState({ definition: def});
        return true;
      }
    }, this);
  }

  handleOnSubmit = e => {
    e.preventDefault();
    const { id, name, version, description, definition } = this.state;

    let data = { application: { name: name, version: version, description: description, definition: definition } }
    if (id!=='') {
      apiCall.update( '/applications/', id, data, this.handleUpdate.bind(this) );
    } else {
      apiCall.create('/applications', data, this.handleUpdate.bind(this) );
    }
  }

  handleUpdate(result, data) {
    if (result) {
      this.getData(data.id);
    } else {
      // Handle result
    }
  }

  handleGetItem(result, data) {
    if (result) {
      this.setState({
        id: data.id,
        name: data.name,
        version: data.version,
        description: data.description,
        definition: data.definition
      });
    } else {
      // Handle error
    }
  }

  getData(id) {
    apiCall.getItem( '/applications/', id, this.handleGetItem.bind(this) );
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getData(this.props.match.params.id);
    }
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div>
        <Paper className={classes.root}>
          <Typography variant="h6" color="inherit" className={classes.header}>
            Application details
          </Typography>
          <Grid container spacing={Number(24)}>
            <Grid item xs={8}>
              <TextField id="name" type="text" label="name" fullWidth margin="normal" variant="outlined"
                className={classes.textField} value={this.state.name} onChange={this.handleChange("name")}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField id="version" type="text" label="version" fullWidth margin="normal" variant="outlined"
                className={classes.textField} value={this.state.version} onChange={this.handleChange("version")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField id="description" type="text" label="description" fullWidth margin="normal" variant="outlined"
                className={classes.textField} value={this.state.description} onChange={this.handleChange("description")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField id="system" type="text" label="system" fullWidth margin="normal" variant="outlined"
                className={classes.textField} value={this.state.definition.system} onChange={this.handleDefChange("system")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField id="module" type="text" label="module" fullWidth margin="normal" variant="outlined"
                className={classes.textField} value={this.state.definition.module} onChange={this.handleDefChange("module")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField id="call" type="text" label="call" fullWidth margin="normal" variant="outlined"
                className={classes.textField} value={this.state.definition.call} onChange={this.handleDefChange("call")}
              />
            </Grid>
            {this.state.id &&
              <Grid item xs={12}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <CustomTableCell>Name</CustomTableCell>
                      <CustomTableCell>Type</CustomTableCell>
                      <CustomTableCell>Format</CustomTableCell>
                      <CustomTableCell>In/Out</CustomTableCell>
                      <CustomTableCell>Default</CustomTableCell>
                      <CustomTableCell>Actions</CustomTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.definition.data.map((item,key) => {
                      return (item.id!==this.state.edit_id) ?
                      <TableRow className={classes.row} key={key}>
                        <CustomTableCell>
                          {item.name}
                        </CustomTableCell>
                        <CustomTableCell>
                          {item.type}
                        </CustomTableCell>
                        <CustomTableCell>
                          {item.format}
                        </CustomTableCell>
                        <CustomTableCell>
                          {item.inout}
                        </CustomTableCell>
                        <CustomTableCell>
                          {item.default}
                        </CustomTableCell>
                        <CustomTableCell>
                          <IconButton aria-label="edit application" className={classes.button} onClick={this.handleEditData(item)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton aria-label="Delete application" className={classes.button} onClick={this.handleDeleteData(item)}>
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
                          <FormControl variant="outlined" className={classes.formControl}>
                            <Select native value={this.state.edit_inout}
                              onChange={this.handleChange('edit_inout')}
                              input={<OutlinedInput name="edit_inout" id="edit_inout" />} >
                              <option value="" />
                              <option value="In">In</option>
                              <option value="Out">Out</option>
                              <option value="InOut">InOut</option>
                            </Select>
                          </FormControl>
                        </CustomTableCell>
                        <CustomTableCell>
                          <TextField id="edit_default" margin="normal" variant="outlined"
                            className={classes.textField} value={this.state.edit_default}
                            onChange={this.handleChange("edit_default")} />
                        </CustomTableCell>
                        <CustomTableCell>
                          <IconButton variant="contained" color="primary"
                            className={classes.button} onClick={this.handleSaveData}>
                            <SaveIcon fontSize="small" />
                          </IconButton>
                          <IconButton variant="contained" color="secondary"
                            className={classes.button} onClick={this.handleCancelData}>
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </CustomTableCell>
                      </TableRow>
                    })}
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
                        <FormControl variant="outlined" className={classes.formControl}>
                          <Select native value={this.state.new_inout}
                            onChange={this.handleChange('new_inout')}
                            input={<OutlinedInput name="new_inout" id="new_inout" />} >
                            <option value="" />
                            <option value="In">In</option>
                            <option value="Out">Out</option>
                            <option value="InOut">InOut</option>
                          </Select>
                        </FormControl>
                      </CustomTableCell>
                      <CustomTableCell>
                        <TextField id="new_default" margin="normal" variant="outlined"
                          className={classes.textField} value={this.state.new_default}
                          onChange={this.handleChange("new_default")} />
                      </CustomTableCell>
                      <CustomTableCell>
                        <Button variant="contained"
                          className={classes.button}
                          onClick={this.handleAddData.bind(this)} >
                          <AddIcon fontSize="small"/> Add
                        </Button>
                      </CustomTableCell>
                    </TableRow>
                  </TableFooter>
                }
                </Table>
              </Grid>
            }
          </Grid>
          <Grid container justify="flex-end">
            <Button variant="contained" aria-label="Add" color="primary" className={classes.button} onClick={this.handleOnSubmit} >
              Save
            </Button>
          </Grid>
        </Paper>
      </div>
    );
  }
}

Application.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Application);
