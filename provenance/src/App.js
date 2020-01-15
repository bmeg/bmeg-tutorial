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
            // get entire 'traversal'
            return node.closedNeighborhood().union(
              node.successors()
            ).union(
              node.predecessors()
            );
        },
        neighborSelectTime: 500
    });

    this.layout.run()
    this.api.enableMarqueeZoom();

    var selectedEles = cy.$(":selected");
    if (selectedEles.length > 0) {
      cy.zoom({
        level: .40,
        position: selectedEles[0].position()
      });
      this.setState({ selection: [selectedEles[0].data()] });
    } else {
      console.log('no selected element at startup')
    }

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
    if(this._cy.$(":selected").length > 0){
      this.api.highlightNeighbors(this._cy.$(":selected"));
    }

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
    this._cy.remove(":hidden")
    this._cy.remove( this._cy.edges(":hidden") )
    this.layout = this._cy.layout(
      {name: this.props.dataset.layout}
    )
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

    return <div >
    <div>
      <nav>
        <div className="nav-wrapper">
          <ul className="hide-on-med-and-down">
            <li><a href="#/" onClick={this.hideSelected}><i className="fas fa-eye left"></i>Hide Selected</a></li>
            <li><a href="#/" onClick={this.hideUnSelected}><i className="fas fa-eye-slash left"></i>Hide Unselected</a></li>
            <li><a href="#/" onClick={this.showAll}><i className="material-icons left">all_inclusive</i>Show All</a></li>
            <li><a href="#/" onClick={this.zoomToSelected}><i className="material-icons left">zoom_in</i>Zoom To Selected</a></li>
            <li><a href="#/" onClick={this.marqueeZoom}><i className="material-icons left">select_all</i>Marquee Zoom</a></li>
            <li><a href="#/" onClick={this.highlightNeighbors}><i className="fas fa-highlighter left"></i>Highlight Neighbors</a></li>
            <li><a href="#/" onClick={this.removeHighlights}>
              <i className="far fa-highlighter left"></i>
              Remove Highlights</a></li>
            <li><a href="#/" onClick={this.redraw}><i className="material-icons left">refresh</i>Re-Draw</a></li>
            <li><a href="#/" onClick={this.help}><i className="material-icons left">help</i>Help</a></li>
          </ul>
        </div>
      </nav>
    </div>

    <div>
      <CytoscapeComponent
        elements={this.state.elements}
        stylesheet={[
          {
            selector: 'node.unhighlighted',
            style: {
              opacity: 0.3
            }
          },
          {
            selector: 'edge.unhighlighted',
            style: {
              opacity: 0.3
            }
          },
          {
            selector: 'node[path]',
            style: {
              shape: 'barrel'
            }
          },
          {
            selector: 'node[cmd]',
            style: {
              shape: 'triangle'
            }
          },
          {
            selector: 'edge',
            style: {
              width: 1
            }
          }
        ]}
        style={ {
          height:  this.props.dataset.height,
          width: this.props.dataset.width,
          display: 'block',
          overflow: 'scroll'
        } }
        cy={this.handleCy}
      />
    </div>

    <div>
      <ReactTable
        data={ this.state.selection }
        columns = { columns }
      />
    </div>
    </div>;
  }
}

export default App;
