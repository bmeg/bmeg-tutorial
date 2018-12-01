/* eslint-disable anchor-is-valid */

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

  handleCy = cy => {
    // cy setup
    if (cy === this._cy && this._handleCyCalled) {
      return;
    }
    this._cy = cy;
    this._handleCyCalled = true;
    this.layout= cy.layout(
      {name: this.props.dataset.layout}
    )
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
    this.layout.run()
    this.api.enableMarqueeZoom();
  }

  //
  // button handlers
  //
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
  hideUnSelected = e => {
    this.api.disableMarqueeZoom();
    var nodesWithHiddenNeighbor = this._cy.edges(":hidden").connectedNodes(':visible');
    this.thinBorder(nodesWithHiddenNeighbor);
    this.api.hide(this._cy.$(":unselected"));
    nodesWithHiddenNeighbor = this._cy.edges(":hidden").connectedNodes(':visible');
    this.thickenBorder(nodesWithHiddenNeighbor);
  }
  showAll = e => {
    this.api.disableMarqueeZoom();
    var nodesWithHiddenNeighbor = this._cy.edges(":hidden").connectedNodes(':visible');
    this.thinBorder(nodesWithHiddenNeighbor);
    this.api.show(this._cy.elements());
  }
  redraw = e => {
    this.layout.run();
  }
  help = e => {
    window.M.toast({html: '<i>SHIFT + drag to specify region.  SHIFT + taphold to select neighbors</i>'})
  }

  render() {
    if (! this.state.elements) {
        return <div/>;
    }

    const keys = ['_label', 'cmd', 'path'];
    const columns = keys.map((key) => {return { Header: key, accessor: key }});

    return <div>
      <nav>
        <div className="nav-wrapper">
          <ul className="right hide-on-med-and-down">
            <li><a href="#/" onClick={this.hideSelected}>Hide Selected</a></li>
            <li><a href="#/" onClick={this.hideUnSelected}>Hide Unselected</a></li>
            <li><a href="#/" onClick={this.showAll}>Show All</a></li>
            <li><a href="#/" onClick={this.zoomToSelected}>Zoom To Selected</a></li>
            <li><a href="#/" onClick={this.marqueeZoom}>Marquee Zoom</a></li>
            <li><a href="#/" onClick={this.highlightNeighbors}>Highlight Neighbors</a></li>
            <li><a href="#/" onClick={this.removeHighlights}>Remove Highlights</a></li>
            <li><a href="#/" onClick={this.redraw}>Re-Draw</a></li>
            <li><a href="#/" onClick={this.help}>Help</a></li>
          </ul>
        </div>
      </nav>
      <div>
        <CytoscapeComponent
          elements={this.state.elements}
          style={ { height:  this.props.dataset.height , width: this.props.dataset.width } }
          cy={this.handleCy}
        />
      </div>
      <ReactTable
        data={ this.state.selection }
        columns = { columns }
      />
    </div>;
  }
}

export default App;
