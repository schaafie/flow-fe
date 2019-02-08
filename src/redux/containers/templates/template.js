import { connect } from 'react-redux'
import {newTemplate, openTemplate, saveTemplate, changeTemplateGen} from '../../actions.js'
import ComponentTemplate from '../../../components/Templates/template.js'

const mapStateToProps = (state) => ({
  template: state.currenttemplate
})

const mapDispatchToProps = ({
  onNewTemplate: newTemplate,
  openTemplate: openTemplate,
  saveTemplate: saveTemplate,
  changeTemplateValue: changeTemplateGen
})

const Template = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComponentTemplate)

export default Template
