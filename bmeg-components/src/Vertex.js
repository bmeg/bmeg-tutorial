import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from "react-redux";
import classNames from 'classnames';
import { push } from 'react-router-redux'
import * as _ from 'underscore'
import Properties from './Properties'

var snipPrefix = function(s) {
  return s.substring(s.indexOf(':') + 1)
}

export class VertexEdges extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const props = this.props
    const prefix = (props.edges[0]['in'] || props.edges[0]['out']).split(':')[0]
    const header = <span>{props.label + ' '}<span className="edge-direction">({props.direction} {prefix})</span></span>

    const items = props.edges.map(function(gid) {
      const vertexGid = gid['in'] || gid['out']
      const edgeGid = {from: gid['in'] || props.gid, label: props.label, to: gid['out'] || props.gid};
      return (
        <ExpandoItem key={vertexGid}>
          <a onClick={() => props.navigate(edgeGid)}>{snipPrefix(vertexGid)}</a>
        </ExpandoItem>
      )
    });

    return <Expando header={header}>{items}</Expando>
  }
}

var EdgesView = function(props) {
  var inEdges = Object.keys(props.vertex['in'])
      .filter(key => key != 'hasInstance')
      .map(function(key) {
        return (
          <VertexEdges
            key={key}
            gid={props.vertex['gid']}
            label={key}
            navigate={props.navigate}
            edges={props.vertex['in'][key]}
            direction="from" />
        )})

  var outEdges = Object.keys(props.vertex['out'])
      .filter(key => key != 'hasInstance')
      .map(function(key) {
        return (
          <VertexEdges
            key={key}
            gid={props.vertex['gid']}
            label={key}
            navigate={props.navigate}
            edges={props.vertex['out'][key]}
            direction="to" />
        )})

  return (
    <div>
      <div className="vertex-edges-wrapper">
        <div className="vertex-in-edges vertex-edges">
          <h4>In Edges</h4>
          {inEdges}
        </div>
        <div className="vertex-out-edges vertex-edges">
          <h4>Out Edges</h4>
          {outEdges}
        </div>
      </div>
    </div>
  )
}

var Expando = React.createClass({
  getInitialState() {
    return {
      collapsed: true,
    }
  },
  componentDidMount() {
    var content = document.getElementById(this.refs.content)
    if (content) {
      content.css('margin-top', -content.height())
    }
  },
  onClick() {
    this.setState({collapsed: !this.state.collapsed})
  },
  render() {
    var props = this.props
    var rootClassName = classNames("expando", "mdl-collapse", "mdl-navigation", {
      "mdl-collapse--opened": !this.state.collapsed,
    })

    return (
        <div className={rootClassName}>
        <a className="mdl-navigation__link mdl-collapse__button expando-header" onClick={this.onClick}>
        <i className="material-icons mdl-collapse__icon mdl-animation--default">expand_more</i>
        {props.header}
      </a>
        <div className="mdl-collapse__content-wrapper expando-content">
        <div className="mdl-collapse__content mdl-animation--default" ref="content">
        {props.children}
      </div>
        </div>
        </div>)
  }
})

function ExpandoItem(props) {
  return <span className="mdl-navigation__link">{props.children}</span>
}

function makeTitle(vertex) {
  console.log(vertex)
  return <h2>{vertex.label} {snipPrefix(vertex.gid)}</h2>
}

export class Vertex extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('vertex mounting!')
    console.log(this.props)
    const { dispatch, vertex, gid } = this.props
    if (_.isEmpty(vertex) || vertex.gid !== gid) {
      dispatch({
        type: 'VERTEX_FETCH',
        gid: gid
      })
    }
  }

  navigateEdge(edge) {
    const { dispatch } = this.props
    const { from, label, to } = edge
    dispatch(push('/explore/edge/' + from + '/' + label + '/' + to))
  }

  render() {
    var we = this
    if (this.props.vertex) {
      var title = <div>{makeTitle(this.props.vertex)}</div>
      var spacing = <div key="spacing" className="spacing"></div>
      var visualizations = []
      var properties

      if (this.props.vertex.properties) {
        properties = (
          <div>
            <Properties entity={this.props.vertex} />
            <EdgesView vertex={this.props.vertex} navigate={this.navigateEdge.bind(this)} />
          </div>
        )
      }

      return (
        <div id="vertex-container">
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
    gid: own.params.gid,
    vertex: state.schema.vertex,
  }
}
export default connect(mapStateToProps) (Vertex)
