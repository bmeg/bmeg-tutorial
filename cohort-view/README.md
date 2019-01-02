
# Developing React code to do queries against a GRIP server

## Getting Started

To start this project, we'll be using the following components:
 - (GRIP server)[https://github.com/bmeg/grip] to server data
 - (Node)[https://nodejs.org] do Javascript development
 - (Yarn)[https://yarnpkg.com/] Javascript package management and compilation
 - (React)[https://reactjs.org/] User interface library
 - (MaterializeCSS)[https://materializecss.com] Material design style sheet
 - (React Materialize)[https://react-materialize.github.io] React wrapper for MaterializeCSS

To get started, create the project using YARN.
 * You’ll need to have Node >= 6 on your local development machine (more)[https://facebook.github.io/create-react-app/docs/getting-started]


If yarn is not installed:

On MacOS:
 - Install (Brew)[https://brew.sh/]
 - `brew install yarn`

Using NPM, install as global command for single user:
Create install directory
```
mkdir ~/.node_modules_global
```
Config NPM prefix
```
npm config set prefix=$HOME/.node_modules_global
```
Install YARN
```
npm install yarn --global
```
Add yarn into PATH
```
export PATH=$PATH:$HOME/.node_modules_global/bin
```

Create the project folder. In this case we'll be working on a project called cohort-view
```
yarn create react-app cohort-view
```

## Enabling GRIP server

Building GRIP from source:
```
export GOPATH=`pwd`
export PATH=$PATH:$GOPATH/bin
mkdir -p $GOPATH/src/github.com/bmeg
cd $GOPATH/src/github.com/bmeg
git clone https://github.com/bmeg/grip.git
cd grip
make
```

Starting GRIP server
```
grip server
```

## Installing test graph
```
grip load example-graph
```

## List graphs to make sure it was loaded
```
grip list
example-graph
```

Be default GRIP allows for unstructured graphs. However, the GraphQL API endpoint
won't work unless a schema has been defined. Additionally, many UI elements and user
libraries can take advantage of a schema.

We can start by sampling the loaded graph, and seeing if we can deduce the schema:
```
grip schema sample example-graph > example-graph.schema
```
This is now stored as a JSON description of the graph schema structure. It
can be loaded using the command:
```
grip schema load --json example-graph.schema
```

## Connecting Node server to GRIP
The node server has a mode to proxy all unknown requests to a secondary server.
This will allow us to use the Node server for code development, but plug into the
GRIP server for queries. In the `package.json` file, in the top level of JSON keys,
add the entry
```
 "proxy": "http://localhost:8201"
```
This assumes that the GRIP server is running on the same machine, using its
default ports. The package.json file should now look something like:
```
{
  "name": "cohort-view",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.7.0",
    "react-dom": "^16.7.0",
    "react-scripts": "2.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "proxy": "http://localhost:8201"
}
```

## Starting Development

To start React development, `yarn start` from the `cohort-view` directory. This
will allow for the full react development environment with autoloading, full
stack traces, etc.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Adding MaterializeCSS

Use npm to add the react-materialize component.
```
npm install react-materialize
```

This should add the line
```
    "react-materialize": "^2.6.0",
```
 to your `package.json` under the `dependencies` section.

The HTML will need to be customized. Edit the file `public/index.html`
The the <head> section of the HTML, add the following lines:
```
     <!-- Import Google Icon Font -->
     <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
     <!-- Import materialize.css -->
     <link href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css" rel="stylesheet">
```
In the beginning of the <body> section of the HTML, add the following lines:
```
     <!-- Import jQuery before materialize.js -->
     <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
     <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js"></script>
```

Replace the default `App.js` code with
```
import React, { Component } from 'react';
import {Button, Icon} from 'react-materialize'

class App extends Component {
  render() {
    return (
      <Button>Hello<Icon>done</Icon></Button>
    );
  }
}

export default App;
```

On [http://localhost:3000](http://localhost:3000) you should see the `Hello` button.


# Adding a GRIP query

Copy in the `gripql.js` file. Then import the code into your App.js by adding the line:
```
import {gripql} from './gripql.js'
```


## Adding a query

```
gripql.query("gdc").V().hasLabel("Project").render(["_gid", "gdc_attributes.name"]).execute( x => {
  var newMap = {}
  for (var i = 0; i < x.length; i++) {
    newMap[x[i].render[0]] = x[i].render[1]
  }
  this.setState({isLoaded:true, projects:newMap})
})
```


## Adding a table
```
yarn add react-table
```

## Exporting code

```
npm run build
```

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
