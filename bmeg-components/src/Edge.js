import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from "react-redux"
import classNames from 'classnames'
import { push } from 'react-router-redux'
import * as _ from 'underscore'
import Properties from './Properties'

export function snipPrefix(s) {
  return s.substring(s.indexOf(':') + 1)
}

function labelFor(gid) {
  return gid.split(':')[0];
}

function makeTitle(edge) {
  return (
    <h2>
      {snipPrefix(edge['out'])}
      <span className="edge-arrow">{' --> '}</span>
      {edge['label']}
      <span className="edge-arrow">{' --> '}</span>
      {snipPrefix(edge['in'])}
    </h2>
  )
}

export class VertexesView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props)
    const navigate = this.props.navigate
    const from = this.props.edge['out']
    const to = this.props.edge['in']

    return (
      <div>
        <div className="vertex-edges-wrapper">
          <div className="vertex-in-edges vertex-edges">
            <h4>from {labelFor(from)}</h4>
            <a onClick={() => navigate(from)}>{snipPrefix(from)}</a>
          </div>
          <div className="vertex-out-edges vertex-edges">
            <h4>to {labelFor(to)}</h4>
            <a onClick={() => navigate(to)}>{snipPrefix(to)}</a>
          </div>
        </div>
      </div>
    )
  }
}

function edgeEq(f, l, t, g, m, u) {
  return f === g && l === m && t === u
}

export class Edge extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('edge mounting!')
    console.log(this.props)
    const { dispatch, edge, from, label, to } = this.props
    if (_.isEmpty(edge) || !edgeEq(edge.from, edge.label, edge.to, from, label, to) ) {
      dispatch({
        type: 'EDGE_FETCH',
        from: from,
        label: label,
        to: to,
      })
    }
  }

  navigateVertex(gid) {
    const { dispatch } = this.props
    dispatch(push('/explore/vertex/' + gid))
  }

  render() {
    if (this.props.edge) {
      const title = <div>{makeTitle(this.props.edge)}</div>
      const spacing = <div key="spacing" className="spacing"></div>
      var properties

      if (this.props.edge.properties) {
        properties = (
          <div>
            <Properties entity={this.props.edge} />
            <VertexesView edge={this.props.edge} navigate={this.navigateVertex.bind(this)} />
          </div>
        )
      }

      return (
        <div id="edge-container">
        {title}
        {spacing}
        {properties}
        </div>
      )
    } else {
      return <img src="/img/ripple.gif" width="50px" />
    }
  }
}

function mapStateToProps(state, own) {
  return {
    from: own.params.from,
    label: own.params.label,
    to: own.params.to,
    edge: state.schema.edge,
  }
}
export default connect(mapStateToProps) (Edge)
