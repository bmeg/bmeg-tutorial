import CytoscapeComponent from 'react-cytoscapejs';
import React from 'react';

import ReactTable from "react-table";
import 'react-table/react-table.css'


// import COSEBilkent from 'cytoscape-cose-bilkent';
// import Cytoscape from 'cytoscape';
// Cytoscape.use(COSEBilkent);

class App extends React.Component {
  state = {
      selection: [{'foo': 'bar'}]
  }
  _handleCyCalled = false;

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
    const elements = [
         {
             data: {id: 'one', label: 'Node 1'},
             position: {x: 50, y: 50}
         },
         {
             data: {id: 'two', label: 'Node 2'},
             position: {x: 200, y: 200}
         },
         {
             data: {id: 'three', label: 'Node 3'},
             position: {x: 100, y: 150}
         },
         {
             data: {id: 'four', label: 'Node 4'},
             position: {x: 400, y: 50}
         },
         {
             data: {id: 'five', label: 'Node 5'},
             position: {x: 250, y: 100}
         },
         {
             data: {id: 'six', label: 'Node 6', parent: 'three'},
             position: {x: 150, y: 150}
         },

         {data: {
             source: 'one',
             target: 'two',
             label: 'Edge from Node1 to Node2'
         }},
         {data: {
             source: 'one',
             target: 'five',
             label: 'Edge from Node 1 to Node 5'
         }},
         {data: {
             source: 'two',
             target: 'four',
             label: 'Edge from Node 2 to Node 4'
         }},
         {data: {
             source: 'three',
             target: 'five',
             label: 'Edge from Node 3 to Node 5'
         }},
         {data: {
             source: 'three',
             target: 'two',
             label: 'Edge from Node 3 to Node 2'
         }},
         {data: {
             source: 'four',
             target: 'four',
             label: 'Edge from Node 4 to Node 4'
         }},
         {data: {
             source: 'four',
             target: 'six',
             label: 'Edge from Node 4 to Node 6'
         }},
         {data: {
             source: 'five',
             target: 'one',
             label: 'Edge from Node 5 to Node 1'
         }},
    ];

    // const layout = { name: 'cose-bilkent' };
    // layout={layout}
    console.log(this.state.selection)
    const columns = Object.keys(this.state.selection[0]).map((key, id)=>{
      return {
        Header: key,
        accessor: key
      }
    })

    return <div>
      <CytoscapeComponent
        elements={elements}
        style={ { width: '400px', height: '400px' } }
        layout={ {name: 'random'} }
        cy={this.handleCy}
      />
      <ReactTable
        data={ this.state.selection }
        columns = { columns }
      />
    </div>;
  }
}

// ReactDOM.render( React.createElement(App, document.getElementById('root') ));
export default App;
