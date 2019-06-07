import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list'
import * as _ from 'underscore'

export class Results extends Component {
  render() {
    const { dispatch, search } = this.props
    var entries
    if (this.props.schema.vertexes) {
      const keys = _.keys(this.props.schema.vertexes).sort()
      entries = keys.map(key => {
        var each
        if (this.props.search && this.props.search.results) {
          const found = this.props.search.results[key]
          if (!_.isEmpty(found)) {
            each = found.slice(0, 10).map(to => {
              return (
                <li key={to.gid}>
                  <a onClick={() => dispatch(push('/explore/vertex/' + to.gid))}>
                    {to.gid}
                  </a>
                </li>
              )
            })
          }
        }
        return (
          <div key={key}>
            <h4>{key}</h4>
            <ul>
              {each}
            </ul>
          </div>
        )
      })
    }

    return (
      <div>
        {entries}
      </div>
    )
  }
}

export default connect() (Results)
