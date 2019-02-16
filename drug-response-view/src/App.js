import React, { Component } from 'react';
import {Row, Input} from 'react-materialize'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import {gripql} from './gripql.js'


class DrugResponseSelect extends Component {

    constructor(props) {
       super(props);
       this.state = {
         error: null,
         isLoaded: false,
         caseID: props.caseID,
         curCompound:"",
         responses: {}
       };
       this.getCaseResponses = this.getCaseResponses.bind(this);
       this.onChange = this.onChange.bind(this);
    }

    getCaseResponses(caseID) {
      gripql.query("bmeg_rc1_2").V(caseID).in_("SampleFor").in_("AliquotFor").in_("ResponseIn").execute(x => {
        var responses = {}
        for (var i = 0; i < x.length; i++) {
          responses[x[i].vertex.data.compound_id] = x[i].vertex.data
        }
        this.setState({
          isLoaded: true,
          caseID: caseID,
          curCompound: x[0].vertex.data.compound_id,
          responses: responses,
        })
      })
    }

    componentDidMount() {
      if (this.state.caseID.length > 0) {
        this.getCaseResponses(this.state.caseID)
      }
    }

    componentDidUpdate(prevProps) {
      if (this.state.caseID !== this.props.caseID) {
        this.getCaseResponses(this.props.caseID)
      }
    }


    onChange(event) {
      this.setState({
        isLoaded:this.state.isLoaded,
        caseID:this.state.caseID,
        curCompound:event.target.value,
        responses:this.state.responses
      });
    }

    render() {
      if (this.state.isLoaded) {
        var responseData = this.state.responses[this.state.curCompound];
        var data = [];
        for (var i=0; i < responseData.activity_data_median.length; i++ ) {
          data.push( {
            "activity" : responseData.activity_data_median[i],
            "dose" : responseData.doses_um[i]
          } )
        }

       return (
         <div>
         <Input s={4} type='select' label="Compounds" onChange={this.onChange} defaultValue={this.state.curCompound}>
         {Object.keys(this.state.responses).map( k => (
           <option key={k} value={k}>{k}</option>
         ))}
         </Input>
         <Row>
          <LineChart
                 width={500}
                 height={300}
                 data={data}
                 margin={{
                   top: 5, right: 30, left: 20, bottom: 5,
                 }}
               >
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="dose" />
                 <YAxis dataKey="activity" />
                 <Tooltip />
                 <Legend />
                 <Line type="monotone" dataKey="dose" stroke="#8884d8" activeDot={{ r: 8 }} />
               </LineChart>
             );
         </Row>
         </div>)
      } else {
        return (<div>Loading</div>)
      }
    }

}

class DrugCaseTable extends Component {

  constructor(props) {
     super(props);
     this.state = {
       error: null,
       isLoaded: false,
       project: props.project,
       cases: [],
       curCase: ""
     };
     this.getProjectCases = this.getProjectCases.bind(this);
     this.onChange = this.onChange.bind(this);
  }

  getProjectCases(project) {
    gripql.query("bmeg_rc1_2").V(project).in_("InProject").execute(x => {
      var data = []
      for (var i = 0; i < x.length; i++) {
        data.push( x[i].vertex )
      }
      this.setState({
        isLoaded: true,
        project: project,
        cases: data,
        curCase: this.state.curCase
      })
    })
  }

  componentDidMount() {
    if (this.state.project.length > 0) {
      this.getProjectCases(this.props.project)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.project !== this.props.project) {
      this.getProjectCases(this.props.project)
    }
  }


  onChange(event) {
    this.setState({
      isLoaded:this.state.isLoaded,
      projects:this.state.projects,
      curCase:event.target.value,
      cases:this.state.cases
    });
  }


  render() {
   return (
     <div>
     <Input s={4} type='select' label="Cases" onChange={this.onChange} defaultValue={this.state.curProject}>
     {this.state.cases.map( k => (
       <option key={k.gid} value={k.gid}>{k.gid}</option>
     ))}
     </Input>
     <Row>
     <DrugResponseSelect caseID={this.state.curCase}/>
     </Row>
     </div>)
  }
}

class App extends Component {
  constructor(props) {
     super(props);
     this.state = {
       projects: {"CTRP" : "Project:CTRP", "GDSC" : "Project:GDSC", "CCLE" : "Project:CCLE"},
       curProject: "Project:CTRP_Gastric_Cancer"
     };
     this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      isLoaded:this.state.isLoaded,
      projects:this.state.projects,
      curProject:event.target.value
    });
  }

  render() {
    return (
      <div>
      <Row>
      <Input s={4} type='select' label="Projects" onChange={this.onChange} defaultValue={this.state.curProject}>
      {Object.keys(this.state.projects).map( k => (
        <option key={k} value={this.state.projects[k]}>{this.state.projects[k]}</option>
      ))}
      </Input>
      </Row>
      <Row>
      <DrugCaseTable project={this.state.curProject}/>
      </Row>
      </div>
    );
  }

}
export default App;
