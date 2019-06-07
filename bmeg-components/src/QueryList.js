import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as _ from 'underscore'

import Menu, {
  MenuItem
} from 'material-ui/Menu';

import List, {
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText
} from 'material-ui/List';

export class QueryList extends Component {
  render() {
    const { dispatch } = this.props
    const focus = this.props.focus
    const self = this

    const subheader = (
        <ListSubheader>
        <ListItemIcon>
        <FolderOpenIcon/>
        </ListItemIcon>
        {label}
      {self.state.loadingSubmenuOpen[label] ? <ExpandLess />: <ExpandMore /> }
      </ListSubheader>
    )


    const queriesList = _.map(_.keys(this.props.queries), function(label) {
      const items = _.map(self.props.queries[label], function(query) {
        return (
          <ListItem key={query.key} onClick={self.loadQuery(query).bind(self)}>
            <ListItemIcon>
               <DatabaseIcon/>
            </ListItemIcon>
            {query.key}
          </ListItem>)
      })

      return (
        <List key={label}
              subheader={subheader}
              onClick={self.loadingOpenChange(label).bind(self)}>
          <Collapse in={self.state.loadingSubmenuOpen[label]} transitionDuration="auto" unmountOnExit>
            {items}
          </Collapse>
        </List>
      )
    })

    return (
      {queriesList}
    )
  }
}
