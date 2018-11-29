import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';



function run() {
  // get div where Graph should be rendered
  const graph = document.getElementById('graph')
  if (graph) {
    // get parameters set by caller on element data-* attributes
    const dataset = graph.dataset ;
    ReactDOM.render(<App dataset={dataset}/>, graph);
  }
}

// mount react on page load
if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
