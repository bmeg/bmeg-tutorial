import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as _ from 'underscore'

import { withStyles } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';

import DatabaseIcon from 'mui-icons/fontawesome/database';

import Menu, {
  MenuItem,
} from 'material-ui/Menu';

import List, {
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText
} from 'material-ui/List';

export class QueryMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchor: undefined,
      open: false,
      index: 0,
    }
  }

  handleClickList(event) {
    this.setState({
      open: true,
      anchor: event.currentTarget
    })
  }

  handleRequestClose() {
    this.setState({open: false})
  }

  chooseQuery(query, index) {
    this.setState({index: index, open: false})
    if (this.props.chooseQuery) {
      this.props.chooseQuery(query)
    }
  }

  render() {
    const { dispatch } = this.props
    const self = this
    const selected = this.state.index
    const items = _.map(this.props.options, function(option, index) {
      return (
          <MenuItem
        key={option}
        onClick={function() {self.chooseQuery(option, index)}}
        selected={index === selected}
          >
          <DatabaseIcon/>
          {option}
        </MenuItem>
      )
    })

    return (
      <div>
        <List>
        <ListItem
      // button
      // aria-haspopup="true"
      // aria-controls="lock-menu"
      // aria-label={this.props.title}
      onClick={this.handleClickList.bind(this)}
        >
        <ListItemText
      primary={this.props.title}
      secondary={items[this.state.index]}
        />
        </ListItem>
        </List>
        <Menu
      anchorEl={this.state.anchor}
      open={this.state.open}
      onRequestClose={this.handleRequestClose.bind(this)}
        >
        {items}
      </Menu>
        </div>
    )
  }
}

const theme = createMuiTheme()
const styles = {}

function mapStateToProps(state, own) {
  return {
    chooseQuery: own.chooseQuery || function(query) {
      console.log('choose query', query)
    },
  }
}
export default connect(mapStateToProps) (withStyles(styles) (QueryMenu))
