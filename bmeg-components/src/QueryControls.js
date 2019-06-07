import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as _ from 'underscore'

// import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';

import AddCircleOutlineIcon from 'material-ui-icons/AddCircleOutline';
import FolderOpenIcon from 'material-ui-icons/FolderOpen';
import SaveIcon from 'material-ui-icons/Save';
import FileDownloadIcon from 'material-ui-icons/FileDownload'
import PublishIcon from 'material-ui-icons/Publish'
import ClearIcon from 'material-ui-icons/Clear'
import Collapse from 'material-ui/transitions/Collapse';

import Toolbar from 'material-ui/Toolbar'
import ToolbarGroup from 'material-ui/Toolbar'
import ToolbarSeparator from 'material-ui/Toolbar'
import List, {
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText
} from 'material-ui/List';

import TextField from 'material-ui/TextField';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import ReactTooltip from 'react-tooltip'

import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import DatabaseIcon from 'mui-icons/fontawesome/database';

export class QueryControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      savingValue: '',
      loading: false,
      loadingValue: '',
      loadingSubmenuOpen: {}
    }
  }

  openSaveQuery() {
    this.setState({saving: true})
  }

  closeSaveQuery() {
    this.setState({saving: false})
  }

  savingChange(e) {
    this.setState({savingValue: e.target.value})
  }

  saveQuery() {
    const { dispatch } = this.props

    const query = {
      user: 'root',
      current: this.props.current,
      key: this.state.savingValue,
      focus: this.props.focus,
      path: this.props.path,
      query: this.props.query,
    }

    console.log('saving query', query)
    this.setState({saving: false})

    dispatch({type: 'SAVE_QUERY', query: query})
  }

  openLoadQuery() {
    this.setState({loading: true})
  }

  closeLoadQuery() {
    this.setState({loading: false})
  }

  loadingChange(query) {
    return function(e) {
      console.log(e)
      this.setState({loadingValue: e.target.value})
    }
  }

  loadQuery(query) {
    return function(e) {
      const { dispatch } = this.props
      this.setState({loading: false})
      dispatch({type: 'LOAD_QUERY', query: query})
    }
  }

  loadingOpenChange(label) {
    return function(e) {
      console.log(e)
      let newLoadingSubmenuOpen = Object.assign({}, this.state.loadingSubmenuOpen);
      newLoadingSubmenuOpen[label] = !newLoadingSubmenuOpen[label];
      this.setState({loadingSubmenuOpen: newLoadingSubmenuOpen})
    }
  }

  render() {
    const { dispatch } = this.props
    const focus = this.props.focus
    const self = this

    const queriesList = _.map(_.keys(this.props.queries), function(label) {
      const items = _.map(self.props.queries[label], function(query) {
        return (
          <ListItem key={query.key}
                    onClick={self.loadQuery(query).bind(self)}>
            <ListItemIcon>
               <DatabaseIcon/>
            </ListItemIcon>
            {query.key}
          </ListItem>)
      })

      return (
        <List key={label}
              subheader={
                <ListSubheader>
                  <ListItemIcon>
                     <FolderOpenIcon/>
                  </ListItemIcon>
                  {label}
                  {self.state.loadingSubmenuOpen[label] ? <ExpandLess />: <ExpandMore /> }
                </ListSubheader>
              }
              onClick={self.loadingOpenChange(label).bind(self)}
              >
          <Collapse in={self.state.loadingSubmenuOpen[label]} transitionDuration="auto" unmountOnExit>
            {items}
          </Collapse>
        </List>
      )
    })

    return (
      <div>
      <Toolbar id="query-controls" className="query-controls">
        <ToolbarGroup>
          <ListItem button
                    onClick={() => dispatch({type: 'NEW_QUERY', focus: focus})}
                    data-tip data-for='NEW_QUERY'>
            <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
          </ListItem>
          <ListItem button
                    onClick={this.openLoadQuery.bind(this)}
                    data-tip data-for='LOAD_QUERY'>
            <ListItemIcon><FolderOpenIcon /></ListItemIcon>
          </ListItem>
          <ListItem button
                    onClick={this.openSaveQuery.bind(this)}
                    data-tip data-for='SAVE_QUERY'>
            <ListItemIcon><SaveIcon /></ListItemIcon>
          </ListItem>
          <ListItem button
                    onClick={this.props.toggleChooser}
                    data-tip data-for='INTERSECTON'>
            <ListItemIcon><img color="contrast" src="/media/intersection.png" height="45" /></ListItemIcon>
          </ListItem>
        </ToolbarGroup>
        <ReactTooltip id='NEW_QUERY' type="info">
          <span>Create a new query</span>
        </ReactTooltip>
        <ReactTooltip id='SAVE_QUERY' type="info">
          <span>Save the current query</span>
        </ReactTooltip>
        <ReactTooltip id='LOAD_QUERY' type="info">
          <span>Open a saved query</span>
        </ReactTooltip>
        <ReactTooltip id='INTERSECTON' type="info">
          <span>Intersection of two saved queries</span>
        </ReactTooltip>

      </Toolbar>
      <Dialog open={this.state.saving} onRequestClose={this.closeSaveQuery.bind(this)}>
        <DialogTitle>{`Save ${focus} Cohort`}</DialogTitle>
        <DialogContent>
        <TextField value={this.state.savingValue} onChange={this.savingChange.bind(this)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeSaveQuery.bind(this)}>Cancel</Button>
          <Button onClick={this.saveQuery.bind(this)}>Save Cohort</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={this.state.loading} onRequestClose={this.closeLoadQuery.bind(this)}>
        <DialogTitle>{`Load Query`}</DialogTitle>
        <DialogContent>
        {queriesList}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeLoadQuery.bind(this)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      </div>
    )
  }
}

const theme = createMuiTheme();
const styles = {
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  options: {},
};

function mapStateToProps(state, own) {
  const focus = own.focus

  return {
    focus: focus,
    path: state.path,
    // facets: state.selectedFacets,
    current: state.currentQuery,
    query: state.queryObject,
    queries: state.queries,
  }
}
export default connect(mapStateToProps) (withStyles(styles) (QueryControls))
