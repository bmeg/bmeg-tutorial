import React, { Component } from 'react';
import {Input, Row, Icon} from 'react-materialize'

import {gripql} from './gripql.js'

import ReactTable from "react-table";
import 'react-table/react-table.css'

import d3 from 'd3';

import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;

class Histograph extends Component {

  constructor(props) {
     super(props);
     this.state = {d3: ''}
   }

  componentDidMount() {
    var node = document.createElement('div');

    var width = 300,
        height = 300,
        n = 20;
    var radius = Math.min(width, height) / 2;

    var data = [{"letter":"q","presses":1},{"letter":"w","presses":5},{"letter":"e","presses":2}];


    const color = d3.scale.category10();


    var arc = d3.svg.arc()
    	.outerRadius(radius - 10)
    	.innerRadius(0);

    var labelArc = d3.svg.arc()
    	.outerRadius(radius - 40)
    	.innerRadius(radius - 40);

    var pie = d3.layout.pie()
      	.value(function(d) { return d.presses; })(data);

        var svg = d3.select(node)
        	.append("svg")
        	.attr("width", width)
        	.attr("height", height)
        		.append("g")
        		.attr("transform", "translate(" + width/2 + "," + height/2 +")"); // Moving the center point. 1/2 the width and 1/2 the height

            var g = svg.selectAll("arc")
	.data(pie)
	.enter().append("g")
	.attr("class", "arc");

  g.append("path")
	.attr("d", arc)
	.style("fill", function(d) { return color(d.data.letter);});


    this.setState({d3: node});
  }

  render() {
    return (
      <div>
        <RD3Component data={this.state.d3} />
      </div>
    )
  }

}

class IndividualTable extends Component {

  constructor(props) {
     super(props);
     this.state = {
       error: null,
       isLoaded: false,
       project: props.project,
       individuals: []
     };
     this.getProjectIndividuals = this.getProjectIndividuals.bind(this);
  }

  getProjectIndividuals(project) {
    gripql.query("gdc").V(project).in_("InProject").execute(x => {
      var data = []
      for (var i = 0; i < x.length; i++) {
        data.push( x[i].vertex.data.gdc_attributes )
      }
      this.setState({
        isLoaded: true,
        project: project,
        individuals: data
      })
    })
  }

  componentDidMount() {
    if (this.state.project.length > 0) {
      this.getProjectIndividuals(this.props.project)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.project != this.props.project) {
      this.getProjectIndividuals(this.props.project)
    }
  }

  render() {
     const columns = [{
       Header: 'Name',
       accessor: 'demographic.submitter_id' // String-based value accessors!
     }, {
       Header: 'Gender',
       accessor: 'demographic.gender',
     }, {
       id: 'age', // Required because our accessor is not a string
       Header: 'Age',
       accessor: d => {
         if (d['diagnoses'] !== null) {
           return d['diagnoses'][0].age_at_diagnosis
         }
         return 0;
        }
      }, {
        id: 'vital_status', // Required because our accessor is not a string
        Header: 'Vital Status',
        accessor: d => {
          if (d['diagnoses'] !== null) {
            return d['diagnoses'][0].vital_status
          }
          return 0;
         }
      } ,{
        Header: "Primary Site",
        accessor: 'primary_site'
      }
     ]

   return (
     <div>
     <Histograph/>
      <ReactTable
         data={this.state.individuals}
         defaultPageSize={10}
         columns={columns}/>
     </div>)
 }
}

class App extends Component {
  constructor(props) {
     super(props);
     this.state = {
       error: null,
       isLoaded: false,
       projects: {},
       curProject: ""
     };
     this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    gripql.query("gdc").V().hasLabel("Project").render(["_gid", "gdc_attributes.name"]).execute( x => {
       var newMap = {}
       for (var i = 0; i < x.length; i++) {
         newMap[x[i].render[0]] = x[i].render[1]
       }
       this.setState({isLoaded:true, projects:newMap, curProject:x[0].render[0]})
    })
  }

  onChange(event) {
    this.setState({
      isLoaded:this.state.isLoaded,
      projects:this.state.projects,
      curProject:event.target.value
    });
  }

  render() {
    if (!this.state.isLoaded) {
      return (<div>Loading</div>)
    } else {
      return (
        <div>
        <Row>
        <Input s={4} type='select' label="Projects" onChange={this.onChange} defaultValue={this.state.curProject}>
        {Object.keys(this.state.projects).map( k => (
          <option key={k} value={k}>{this.state.projects[k]}</option>
        ))}
        </Input>
        </Row>
        <IndividualTable project={this.state.curProject}/>
        </div>
      );
    }
  }
}

export default App;
