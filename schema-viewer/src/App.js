import cytoscape from "cytoscape";
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import './App.css';

class App extends Component {

  state = {
    selection: {},
  }

  componentDidMount() {
    fetch(this.props.dataset.url)
      .then(response => response.json())
      .then(data => {
        var edges = data["edges"].map(function(x){
          return {
            "data": {
              "id": x["gid"], 
              "label": x["label"], 
              "source": x["from"], 
              "target": x["to"]
            }, 
            "classes": "autorotate"
          }
        })

        var nodes = data["vertices"].map(function(x){
          return {"data": {"id": x["gid"]}}
        })
          
        this.setState({elements: {"nodes": nodes, "edges": edges}, schema: data})
        console.log("Loaded the graph schema...",)
      }).catch(err => {
        console.log("Failed to load the graph schema:", this.props.dataset.url, ":", err)
      })
  }

  componentDidUpdate() {
    if (!this.state.loaded) {
  	  this.build();
    }
  }

  build() {
    console.log("Cytoscape.js is rendering the graph...");

    var cy = cytoscape(
      {
        container: document.getElementById("cy"),

        boxSelectionEnabled: false,
        autounselectify: false,

        minZoom: 0.1,
        maxZoom: 10,

        elements: this.state.elements,

        style: cytoscape.stylesheet()
          .selector("node")
          .css({
            "height": 80,
            "width": 80,
            "background-fit": "cover",
            'background-color': "#bcbcbc",
            "border-color": "#bcbcbc",
            "font-size": "14px",
            "border-width": 3,
            "border-opacity": 1,
            "text-valign": "center",
            "label": "data(id)"
          })
          .selector("node:selected")
          .css({
            'background-color': "#4286f4",
            "border-color": "#4286f4",
          })
          .selector("edge")
          .css({
            "width": 6,
            "target-arrow-shape": "triangle",
            "line-color": "#ffaaaa",
            "target-arrow-color": "#ffaaaa",
            "curve-style": "bezier",
            "label": "data(label)"
          })
          .selector("edge:selected")
          .css({
            "line-color": "#4286f4",
            "target-arrow-color": "#4286f4",
          })
          .selector(".autorotate")
          .css({
            "edge-text-rotation": "autorotate"
          }),

        layout: {
          name: "cose"
        }
      }
    );

    cy.on('tap', 'edge', event => {
      var targetEdge = event.target.data().id
      var data = {}
      for (var i = 0; i < this.state.schema.edges.length; i++) {
        if (this.state.schema.edges[i].gid === targetEdge) {
          data = this.state.schema.edges[i]
        }
      }
      this.setState({ selection: data });
    })
    cy.on('tap', 'node', event => {
      var targetVertex = event.target.data().id
      var data = {}
      for (var i = 0; i < this.state.schema.vertices.length; i++) {
        if (this.state.schema.vertices[i].gid === targetVertex) {
          data = this.state.schema.vertices[i]
        }
      }
      this.setState({ selection: data });
    })
    this.cy = cy;
    this.setState({ loaded: true });
  }

  render() {
    let cyStyle = {
      height: this.props.dataset.height,
      width: this.props.dataset.width,
      margin: "5px auto",
      borderStyle: "solid",
      borderColor: "#D3D3D3",
      borderWidth: "thin"
    };
    return (
      <div>
        <div style={cyStyle} id="cy"></div>
        <div style={{width: this.props.dataset.width, margin: "5px auto"}} id="reactJson">
          <ReactJson src={this.state.selection} name={false}  enableClipboard={false} displayDataTypes={false}/>
        </div>
      </div>
    );
  }
}

export default App;
