import CytoscapeComponent from 'react-cytoscapejs';
import React from 'react';

import ReactTable from "react-table";
import 'react-table/react-table.css'

class App extends React.Component {

  state = {
      // selected node or edge
      selection: []
  }
  _handleCyCalled = false;

  componentDidMount() {
    // we receieve \n separated json
    const reducer = (accumulator, currentValue) => {
      if (currentValue) {
          accumulator.push(JSON.parse(currentValue));
      }
      return accumulator;
    }
    // get data, assumed to be cytoscape friendly, parse into an array of obj
    fetch(this.props.dataset.url)
      .then(response => response.text())
      .then(data => {
          this.setState({ 'elements': data.split(/\r?\n/).reduce(reducer, []) })
      });
  }

  handleCy = cy => {
    if (cy === this._cy && this._handleCyCalled) {
      return;
    }
    this._cy = cy;
    window.cy = cy;
    this._handleCyCalled = true;
    cy.on('tap', 'edge', event => {
      this.setState({ selection: [event.target.data()] });
    })
    cy.on('tap', 'node', event => {
      this.setState({ selection: [event.target.data()] });
    })
  }

  render() {
    if (! this.state.elements) {
        console.log('Cytoscape - state.elements.empty')
        return <div/>;
    }

    var columns = [];
    if (this.state.selection.length > 0) {
      columns = Object.keys(this.state.selection[0]).map((key, id)=>{
        return {
          Header: key,
          accessor: key
        }
      })
    }
    return <div>
      <CytoscapeComponent
        elements={this.state.elements}
        style={ { height: '800px', width: '800px' } }
        layout={ {name: this.props.dataset.layout} }
        cy={this.handleCy}
      />
      <ReactTable
        data={ this.state.selection }
        columns = { columns }
      />
    </div>;
  }
}

export default App;
