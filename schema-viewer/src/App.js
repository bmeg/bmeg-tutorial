import React from 'react'
import ReactJson from 'react-json-view'
import cytoscape from "cytoscape"
import _ from "underscore"
import './App.css'

function App({ defaultGraph, height, width }) {
  console.log("deafult graph:", defaultGraph, "height:", height, "width:", width)

  const [selection, setSelection] = React.useState({})
  const [error, setError] = React.useState("")
  const [graph, setGraph] = React.useState(defaultGraph)
  const [graphs, setGraphs] = React.useState([])
  const [schema, setSchema] = React.useState({graph: "", nodes: [], edges: []})

  // list graphs
  React.useEffect(() => {
    console.log("listing graphs...")
    fetch( ":8201/v1/graph", {method: "GET"}).then((response) => {
      if (!response.ok) {
        var err = "ERROR: GET " + response.url + " " + response.status + " " + 
            response.statusText
        console.log(err)
        setError(err)
      }
      return response.json()
    }).then((json) => {
      var graphs = json['graphs'].filter(function(g) {
				return g.endsWith("__schema__")
			}).map(x => x.replace("__schema__", ""))
      console.log("found graphs:", graphs)
      setGraphs(graphs)
      if (!_.isEqual(graph, "") && !graphs.includes(graph)) {        
        console.log("default graph", graph, "not found")
        setGraph("")
      }
    }).catch((err) => {
      err = "ERROR: No graphs found"
      console.log(err)
      setError(err)
    })
  }, [])

  // get schema
  React.useEffect(() => {
    if (_.isEqual(graph, "")) {
      return
    }
    console.log("Getting the schema for graph: ", graph)
    fetch( "/v1/graph/" + graph + "/schema", {
      method: "GET",
    }).then((response) => {
      if (!response.ok) {
        var err = "ERROR: GET " + response.url + " " + response.status + " " + 
            response.statusText
        console.log(err)
        setError(err)
      }
      return response.json()
    }).then((json) => {
      setSchema(json)
    }).catch(err => {
      console.log("ERROR:", err)
      err = "ERROR: Failed to load the schema"
      console.log(err)
      setError(err)
    })
    console.log("Loaded the schema for graph: ", graph)
  }, [graph])

  // render cytoscape
  React.useEffect(() => { 
    if (_.isEqual(graph, "")) {
      return
    }

    console.log("Cytoscape.js is rendering the graph...")

    var edges = schema["edges"].map(function(x) {
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
    var nodes = schema["vertices"].map(function(x) {
      return {"data": {"id": x["gid"]}}
    })

    if (_.isEqual(nodes, []) || _.isEqual(edges, [])) {
      var err = "ERROR: Selected graph contains no nodes and/or edges"
      console.log(err)
      setError(err)
      return
    }

    var cy = cytoscape({
      container: document.getElementById("cy"),
      
      boxSelectionEnabled: false,
      autounselectify: false,

      minZoom: 0.1,
      maxZoom: 10,

      elements: {"nodes": nodes, "edges": edges},

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
    })

    cy.on('tap', 'edge', event => {
      var targetEdge = event.target.data().id
      var data = {}
      for (var i = 0; i < schema.edges.length; i++) {
        if (schema.edges[i].gid === targetEdge) {
          data = schema.edges[i]
        }
      }
      setSelection(data)
    })

    cy.on('tap', 'node', event => {
      var targetVertex = event.target.data().id
      var data = {}
      for (var i = 0; i < schema.vertices.length; i++) {
        if (schema.vertices[i].gid === targetVertex) {
          data = schema.vertices[i]
          // add some custom logic
          if (_.isEqual(data.label, "GeneExpression")) {
            data.data.values = {"ENSG00000004059": "STRING",
                                "...": "STRING"}
          } else if (_.isEqual(data.label, "TranscriptExpression")) {
            data.data.values = {"ENST00000000233": "STRING",
                                "...": "STRING"}
          } else if (_.isEqual(data.label, "CopyNumberAlteration")) {
            data.data.values = {"ENSG00000004059": "STRING",
                                "...": "STRING"}
          }
        }
      }
      setSelection(data)
    })

  }, [schema])

  const handleFormSelect = (event) => {
    console.log("selected graph:", event.target.value)
    setGraph(event.target.value)
    setSelection({})
  }

  const selectStyle = {width: "15%", height: "2em", fontSize: "1.25em", 
                       margin: "10px auto", display: "block"}

  const optionItems = React.useMemo(() => {
    return graphs.map((graph) => <option key={graph}>{graph}</option>)
  }, [graphs])

  const cyStyle = React.useMemo(() => {
    return { 
      height: height,
      width: width,
      margin: "5px auto",
      borderStyle: "solid",
      borderColor: "#D3D3D3",
      borderWidth: "thin"
    }
  }, [height, width])

  return (
    <div>
      <div id="selectGraph">
        <select style={selectStyle} value={graph} onChange={handleFormSelect}>
          <option value="" disabled>Select Graph</option>
          {optionItems}
        </select>
      </div>
      <div id="errorMessage">
        <h4 style={{color: "red", textAlign: "center"}}>{error}</h4>
      </div>
      <div style={cyStyle} id="cy"></div>
      <div style={{width: width, margin: "5px auto"}} id="reactJson">
        <ReactJson src={selection} name={false}  enableClipboard={false} displayDataTypes={false}/>
      </div>
    </div>
  )
}

export default App
