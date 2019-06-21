import React from 'react';
import './App.css';

import {Facet} from './Facet2.js';

import {gripql} from "./gripql.js"

function App() {

  var query = function(q) {
    return q.V().hasLabel("Case").has(gripql.eq("experiments", "exp:TCGA-BRCA")).out("samples")
  }
  var config = {
    name: "Name",
    getData: query,
    graph: "test-data",
    facets:[
      {
        "mode" : "list",
        field: "sample_type"
      },{
        mode: "histogram",
        field: "initial_weight"
      }
    ]
  }

  return (
    <div>
      <Facet config={config}/>
    </div>
  );
}

export default App;
