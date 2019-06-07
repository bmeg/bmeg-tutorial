import React from 'react';
import './App.css';

import Facet from './Facet.js';

import { createStore } from "redux";


function App() {
  const store = createStore(null);

  return (
    <div>
      <Facet store={store}/>
    </div>
  );
}

export default App;
