import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from "react-redux"
import { push } from 'react-router-redux'
import * as _ from 'underscore'

import { VennDiagram } from 'venn.js'

export class Venn extends Component {
  constructor(props) {
    super(props)
    this.venn = VennDiagram()
  }

  generateSets(comparison) {
    const intersection = comparison._intersection
    const keys = _.filter(_.keys(comparison), function(key) {return key !== '_intersection'})

    console.log('VENN COMPARISON', comparison, keys, intersection)
    const sets = _.map(keys, function(key) {
      return {sets: [key], size: comparison[key]}
    })

    sets.push({sets: keys, size: intersection})
    console.log('SETS', sets)
    return sets
  }

  generateDiagram(comparison) {
    const sets = this.generateSets(comparison)
    d3.select(this.element).datum(sets).call(this.venn)
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.comparison)) {
      this.generateDiagram(this.props.comparison)
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentWillReceiveProps(props) {
    console.log('venn willreceiveprops', props)
    if (!_.isEmpty(props.comparison)) {
      this.generateDiagram(props.comparison)
    }
  }

  componentDidReceiveProps(props) {
    console.log('venn didreceiveprops', props)
  }

  componentWillUnmount() {}

  render() {
    return (
      <div id="venn" ref={element => this.element = element} />
    )
  }
}

function mapStateToProps(state, own) {
  console.log('venn comparison', own.comparison)
  return {
    comparison: own.comparison,
  }
}
export default connect(mapStateToProps) (Venn)
