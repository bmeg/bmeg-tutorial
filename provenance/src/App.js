import React from 'react';

import CytoscapeComponent from 'react-cytoscapejs';

import ReactTable from "react-table";
import 'react-table/react-table.css'

import Cytoscape from 'cytoscape';
import jquery from 'jquery';
import viewUtilities from 'cytoscape-view-utilities';
viewUtilities(Cytoscape, jquery)

class App extends React.Component {

  state = {
      // selected node or edge
      selection: []
  }
  _handleCyCalled = false;

  componentDidMount() {
    // get data, assumed to be cytoscape friendly, parse into an array of obj
    fetch(this.props.dataset.url)
      .then(response => response.json())
      .then(data => {
          this.setState({ 'elements': data })
      });
  }

  // Increase border width to show nodes with hidden neighbors
  thickenBorder(eles){
    eles.forEach(function( ele ){
      var defaultBorderWidth = Number(ele.css("border-width").substring(0,ele.css("border-width").length-2));
      ele.css("border-width", defaultBorderWidth + 2);
    });
    return eles;
  }
  // Decrease border width when hidden neighbors of the nodes become visible
  thinBorder(eles){
    eles.forEach(function( ele ){
      var defaultBorderWidth = Number(ele.css("border-width").substring(0,ele.css("border-width").length-2));
      ele.css("border-width", defaultBorderWidth - 2);
    });
    return eles;
  }

  handleCy = cy => {
    // cy setup
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
    cy.on('doubleTap', 'node', event => {
      var nodesWithHiddenNeighbor = this._cy.edges(":hidden").connectedNodes(':visible');
      this.thinBorder(nodesWithHiddenNeighbor);
      this.api.show(cy.nodes(":selected").neighborhood().union(cy.nodes(":selected").neighborhood().parent()));
      nodesWithHiddenNeighbor = this._cy.edges(":hidden").connectedNodes(':visible');
      this.thickenBorder(nodesWithHiddenNeighbor);
    })
    cy.on('select', event => {
      // get the graph data behind all selected elements
      var selectedEles = this._cy.$(":selected");
      const reducer = (accumulator, ele) => {
        if (ele) {
            accumulator.push(ele.data());
        }
        return accumulator;
      }
      this.setState({ 'selection': selectedEles.reduce(reducer,[]) })
    })


    this.api = cy.viewUtilities({
        neighbor: function(node){
            return node.successors() || node.outgoers();
        },
        neighborSelectTime: 1000
    });
    this.api.enableMarqueeZoom();
  }

  // button handlers
  zoomToSelected = e => {
    this.api.disableMarqueeZoom();
    var selectedEles = this._cy.$(":selected");
    this.api.zoomToSelected(selectedEles);
  }
  marqueeZoom = e => {
    this.api.enableMarqueeZoom();
  }
  highlightNeighbors = e => {
    this.api.disableMarqueeZoom();
    if(this._cy.$(":selected").length > 0)
      this.api.highlightNeighbors(this._cy.$(":selected"));
  }
  removeHighlights = e => {
    this.api.disableMarqueeZoom();
    this.api.removeHighlights();
  }
  hideSelected = e => {
    this.api.disableMarqueeZoom();
    var nodesWithHiddenNeighbor = this._cy.edges(":hidden").connectedNodes(':visible');
    this.thinBorder(nodesWithHiddenNeighbor);
    this.api.hide(this._cy.$(":selected"));
    nodesWithHiddenNeighbor = this._cy.edges(":hidden").connectedNodes(':visible');
    this.thickenBorder(nodesWithHiddenNeighbor);
  }
  showAll = e => {
    this.api.disableMarqueeZoom();
    var nodesWithHiddenNeighbor = this._cy.edges(":hidden").connectedNodes(':visible');
    this.thinBorder(nodesWithHiddenNeighbor);
    this.api.show(this._cy.elements());
  }

  render() {
    if (! this.state.elements) {
        return <div/>;
    }

    const keys = ['_label', 'cmd', 'path'];
    const columns = keys.map((key) => {return { Header: key, accessor: key }});

    return <div>
      <button onClick={this.hideSelected}>Hide Selected</button>
      <button onClick={this.showAll}>Show All</button><br/>
      <button onClick={this.zoomToSelected}>Zoom To Selected</button><br/>
      <button onClick={this.marqueeZoom}>Marquee Zoom</button><i>SHIFT + drag to specify region</i><br/>
      <button onClick={this.highlightNeighbors}>Highlight Neighbors</button>
      <button onClick={this.removeHighlights}>Remove Highlights</button><br/>


      <CytoscapeComponent
        elements={this.state.elements}
        style={ { height:  this.props.dataset.height , width: this.props.dataset.width } }
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
