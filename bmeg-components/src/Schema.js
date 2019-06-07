import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import cytoscape from 'cytoscape'
import * as _ from 'underscore'

import Path from '../query/path.js'
import { getIn, assocIn, mergeIn, updateIn } from '../state/state'
import { expandSchema, schemaGraph, generateQuery } from '../query/query'

function schemaToCytoscape(schema, path, query) {
  if (_.isEmpty(schema)) {
    return {nodes: [], edges: []}
  } else {
    // var steps = Path.nodesIn(schema, path)
    // var tail = _.last(path)
    // var focus = tail ? tail.label : null
    // console.log('PATH SCHEMA STEPS', focus, path, steps)

    var focus = query.focus

    var nodes = Object.keys(schema['vertexes']).map(function(key) {
      var vertex = schema['vertexes'][key]
      var active = query[vertex.label] ? !_.isEmpty(query[vertex.label].selectedFacets) : false

      return {
        data: {
          id: vertex.gid,
          name: vertex.label,
          active: active,
          // active: !_.isEmpty(steps[vertex.label]),
          focus: vertex.label === focus,
        }
      }
    })

    var edges = _.flatten(Object.keys(schema['from']).map(function(key) {
      return schema['from'][key].map(function(edge) {
        return {
          data: {
            id: edge['label'],
            source: edge['from'],
            target: edge['to'],
            label: edge['label'],
          }
        }
      })
    }))

    return {
      nodes: nodes,
      edges: edges
    }
  }
}

export class Schema extends Component {
  constructor(props){
    super(props)
    this.renderCytoscape = this.renderCytoscape.bind(this)

    // this.schemaPositions = {
    //   Project: [0.0, 0.5],
    //   Individual: [0.15, 0.5],
    //   Cohort: [0.15, 0.3],
    //   Biosample: [0.3, 0.5],
    //   GeneExpression: [0.5, 0.2],
    //   Variant: [0.5, 0.35],
    //   CNASegment: [0.5, 0.5],
    //   Compound: [0.5, 0.65],
    //   Predictor: [0.5, 0.8],
    //   OntologyTerm: [0.5, 0.95],
    //   LinearSignature: [0.65, 0.75],
    //   PhenotypeInstance: [0.65, 0.9],
    //   Gene: [0.7, 0.5],
    //   GeneDatabase: [0.85, 0.35],
    //   Pubmed: [0.85, 0.5],
    //   GeneFamily: [0.85, 0.65],
    // }

    this.schemaPositions = {
      // spine
      Project: [0.0, 0.5],
      Individual: [0.2, 0.5],
      Biosample: [0.4, 0.5],
      Gene: [0.8, 0.5],
      Pubmed: [1.0, 0.5],

      // biosample halo
      Cohort: [0.25, 0.18],
      GeneExpression: [0.38, 0.0],
      CNASegment: [0.54, 0.05],
      Variant: [0.59, 0.33],
      Compound: [0.59, 0.67],
      OntologyTerm: [0.5, 0.93],

      // // biosample halo
      // Cohort: [0.27, 0.15],
      // GeneExpression: [0.4, 0.0],
      // CNASegment: [0.55, 0.15],
      // Compound: [0.55, 0.85],
      // OntologyTerm: [0.4, 1.0],

      // gene halo
      GeneFamily: [0.7, 0.0],
      GeneDatabase: [0.9, 0.0],
      Evidence: [0.9, 1.0],

      // Predictor: [0.5, 0.8],
      // LinearSignature: [0.65, 0.75],
      // PhenotypeInstance: [0.65, 0.9],
    }
  }

  calculatePositions(width, height) {
    var self = this;
    return Object.keys(this.schemaPositions).reduce(function(positions, key) {
      var ratio = self.schemaPositions[key]
      if (ratio) {
        positions[key] = {x: ratio[0] * width, y: ratio[1] * height}
      } else {
        positions[key] = {x: 100, y: 100}
      }
      return positions
    }, {})
  }

  renderCytoscape(schema) {
    var nodeColor = '#594346'
    var focusColor = '#7ec950'
    var activeColor = '#105a8c'
    var nodeText = '#ffffff'
    var edgeText = '#ffffff'
    var edgeColor = '#4286f4'
    // var edgeColor = '#0f53c1'
    // var edgeColor = '#f22f08'
    const {dispatch, width, height} = this.props

    var radius = Math.min(width, height) * 0.24 // * 0.08;

    var cyelement = this.refs.cytoscape
    this.cy = cytoscape({
      container: cyelement,
      boxSelectionEnabled: false,
      autounselectify: true,
      userZoomingEnabled: false,
      userPanningEnabled: false,

      style: cytoscape.stylesheet()
        .selector('node')
        // .selector('node[!active]')
        .css({
          'content': 'data(name)',
          'height': radius, // 80
          'width': radius, // 80
          'background-fit': 'cover',
          'background-color': nodeColor,
          // 'border-color': '#000',
          // 'border-width': 3,
          // 'border-opacity': 0.5,
          // 'shape': 'roundrectangle',
          'color': nodeText,
          'font-family': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
          'font-size': radius * 0.24, // 24
          'text-outline-color': nodeColor,
          'text-outline-width': radius * 0.03, // 3,
          'text-valign': 'center'
        })

        .selector('node[?active]')
        .css({
          'background-color': activeColor,
        })

        .selector('node[?focus]')
        .css({
          'background-color': focusColor,
        })

        .selector('edge')
        .css({
          'content': 'data(label)',
          'width': radius * 0.06,
          'edge-text-rotation': 'autorotate',
          'target-arrow-shape': 'triangle',
          'line-color': edgeColor,
          'target-arrow-color': edgeColor,
          'curve-style': 'bezier',
          'color': edgeText,
          'font-size': radius * 0.18, // 18
          'text-outline-color': edgeColor,
          'text-outline-width': radius * 0.03, // 2
        }),

      elements: schema
    })

    this.cy.on('tap', 'node', function(cy) {
      const label = this.id()
      // console.log('SCHEMA_TAP_VERTEX', label)
      dispatch({
        type: 'SCHEMA_TAP_VERTEX',
        label: label,
      })
    })

    this.cy.on('tap', 'edge', function(cy) {
      const label = this.id()
      console.log('SCHEMA_TAP_EDGE', label)
      dispatch({
        type: 'SCHEMA_TAP_EDGE',
        label: label,
      })
    })

    this.layout = this.cy.makeLayout({
      name: 'preset',
      positions: this.calculatePositions(width, height)
      // animate: true,
      // padding: 30,
      // animationThreshold: 250,
      // refresh: 20
    })

    // this.layout = this.cy.makeLayout({
    //   name: 'cose' // ,
    //   // animate: true,
    //   // padding: 30,
    //   // animationThreshold: 250,
    //   // refresh: 20
    // })
  }

  generateSchema(schema, path, query) {
    // console.log('rendering schema')
    var next = schemaToCytoscape(schema, path, query)
    if (false) { // (this.cy) {
      this.cy.json(next)
    } else {
      this.renderCytoscape(next)
    }

    this.runLayout()
    this.cy.resize()
  }

  componentDidMount() {
    if (this.props.schema) {
      this.generateSchema(this.props.schema, this.props.path, this.props.query)
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentWillReceiveProps(props) {
    this.generateSchema(props.schema, props.path, props.query)
  }

  componentDidReceiveProps(props) {
    this.cy.resize()
  }

  componentWillUnmount() {
    this.cy.destroy()
  }

  runLayout() {
    this.layout.run()
  }

  cytoscape() {
    return this.cy
  }

  render(){
    let containerStyle = {
      height: this.props.height || '100px',
      width: this.props.width || '100px'
    }

    return(
      <div>
        <div id="cy" style={containerStyle} ref="cytoscape" />
      </div>
    )
  }
}

function mapStateToProps(state, own) {
  console.log('query', state.queryObject)

  return {
    schema: state.schema,
    path: state.path,
    query: state.currentQuery,
    counts: state.counts,
  }
}

export default connect(mapStateToProps) (Schema)
