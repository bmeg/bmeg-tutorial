import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from "react-redux";
import * as _ from 'underscore'

function PropertyRow(props) {
  var value = props.value
  if (_.isArray(value)) {
    value = JSON.stringify(value)
  } else if (_.isObject(value)) {
    value = JSON.stringify(value)
  }

  return (
    <tr>
      <td className="prop-key mdl-data-table__cell--non-numeric">{props.name}</td>
      <td className="mdl-data-table__cell--non-numeric">{value}</td>
    </tr>
  )
}

export class Properties extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const entity = this.props.entity
    const properties = Object.keys(entity.properties).map(function(key) {
      const value = entity.properties[key]
      return <PropertyRow key={key} name={key} value={value} />
    })

    return (
      <div>
        <div className="entity-properties">
          <table className="prop-table mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shad--2dp">
            <tbody>
             {properties}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default connect() (Properties)
