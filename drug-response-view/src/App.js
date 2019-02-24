import React, { Component } from 'react';
import {Row, Input, Checkbox, Preloader, Modal, Button} from 'react-materialize'

import {
  VictoryChart, VictoryLine,
} from 'victory';

import {gripql} from './gripql.js'

var GRAPH = "bmeg_rc1_2"

class DrugCurve extends Component {

    constructor(props) {
       super(props);
       this.state = {
         caseResponses: props.caseResponses
       };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
          caseResponses: nextProps.caseResponses
      })
    }

    render() {
      var lines = []
      for (var c in this.state.caseResponses) {
        var responseData = this.state.caseResponses[c];
        var lineData = []
        for (var i=0; i < responseData.activity_data_median.length; i++ ) {
          var activity = responseData.activity_data_median[i];
          var dose = responseData.doses_um[i];
          lineData.push({ x:dose, y:activity })
        }
        lines.push( <VictoryLine key={c} data={lineData} /> )
      }
      return (
        <div>
        <VictoryChart
               width={600}
               height={400}
               animate={{ duration: 1000 }}
             >
               {lines}
        </VictoryChart>
        </div>
      );
    }

}

class CaseVariantSelector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>Selecting Samples by Variant</div>)
  }
}

class DrugCaseTable extends Component {

  constructor(props) {
     super(props);
     this.state = {
       error: null,
       isLoaded: false,
       project: props.project,
       compounds: [],
       responseData: {},
       chartData: [],
       curCases: [],
       curCompound : ""
     };
     this.getProjectDrugs = this.getProjectDrugs.bind(this);
     this.onCompoundChange = this.onCompoundChange.bind(this);
     this.onCaseChange = this.onCaseChange.bind(this);
     this.getResponseData = this.getResponseData.bind(this);
  }

  getProjectDrugs(project) {
    gripql.query(GRAPH).V(project).in_("InProject").in_("SampleFor").in_("AliquotFor").in_("ResponseIn").out("ResponseTo").distinct("$._gid").render("$._gid").call().then( compoundRes => {
      var compounds = []
      for (var i = 0; i < compoundRes.length; i++) {
        compounds.push( compoundRes[i].render )
      }
      var curCompound = compounds[0];
      this.getResponseData(curCompound, project).then( x=> {
        this.setState({
          isLoaded: true,
          project: project,
          compounds:compounds,
          responseData:x,
          curCases: this.state.curCases,
          curCompound : this.state.curCompound,
          chartData: []
        })
      } )
    })
  }


  componentDidMount() {
    if (this.state.project.length > 0) {
      this.getProjectDrugs(this.props.project)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.project !== this.props.project) {
      this.getProjectDrugs(this.props.project)
    }
  }

  getResponseData(compound, project) {
    var q = gripql.query(GRAPH).V(compound).in_("ResponseTo").as_("response").out("ResponseIn")
    q = q.out("AliquotFor").out("SampleFor").as_("case")
    q = q.out("InProject").has(gripql.eq("_gid", project))
    q = q.select(["case", "response"])
    return q.call().then( x => {
      var out = {};
      for (var i = 0; i < x.length; i++) {
        var response = x[i].selections.selections.response.vertex.data;
        var caseID = x[i].selections.selections["case"].vertex.gid;
        out[caseID] = response
      }
      return out
    })
  }

  onCompoundChange(event) {
    this.setState({
      isLoaded:this.state.isLoaded,
      projects:this.state.projects,
      compounds:this.state.compounds,
      curCompound:event.target.value,
      curCases:[],
      chartData:[]
    });
  }

  onCaseChange(event) {
    var chartData = {}
    var curCases = []
    console.log(this.state.responseData)
    Object.keys(event.target.childNodes).map( x => {
      if (event.target.childNodes[x].selected) {
        var caseID = event.target.childNodes[x].value
        curCases.push(caseID)
        chartData[caseID] = this.state.responseData[ caseID ]
      }
    })
    console.log(chartData)
    this.setState({
      isLoaded:this.state.isLoaded,
      projects:this.state.projects,
      compounds:this.state.compounds,
      curCompound:this.state.curCompound,
      curCases:curCases,
      chartData:chartData
    });
  }

  render() {
  if (this.state.isLoaded) {
     return (
       <div style={{display:"grid", 'gridTemplateColumns':"220px auto"}}>
       <div style={{'gridColumn':"1"}}>
       <Input s={3} type='select' label="Compounds" onChange={this.onCompoundChange} defaultValue={this.state.curCompound}>
       {this.state.compounds.map( k => (
         <option key={k} value={k}>{k}</option>
       ))}
       </Input>
       </div>

       <div style={{'gridColumn':"1"}}>
       <Modal
        header='Modal Header'
        trigger={<Button>Select by Mutation</Button>}>
          <CaseVariantSelector/>
      </Modal>
       <Input type="select" multiple label="Cases" onChange={this.onCaseChange}>
       {Object.keys(this.state.responseData).map( k => (
         <option key={k} type='checkbox' value={k}>{k}</option>
       ))}
       </Input>
       </div>
       <div type={{'gridColumn':2}}>
       <DrugCurve caseResponses={this.state.chartData}/>
       </div>
       </div>
       )
    } else {
      return (<Preloader/>)
    }
  }
}

class App extends Component {
  constructor(props) {
     super(props);
     this.state = {
       isLoaded: false,
       projects: {},
       curProject: ""
     };
     this.onChange = this.onChange.bind(this);
     this.getProjects = this.getProjects.bind(this);
  }

  getProjects() {
    gripql.query(GRAPH).V().hasLabel("Project").execute(x => {
      var data = {}
      for (var i = 0; i < x.length; i++) {
        data[x[i].vertex.gid] = x[i].vertex.gid;
      }
      this.setState({
        isLoaded: true,
        projects: data,
        curProject: x[0].vertex.gid
      })
    })
  }

  componentDidMount() {
    this.getProjects()
  }

  onChange(event) {
    this.setState({
      isLoaded:this.state.isLoaded,
      projects:this.state.projects,
      curProject:event.target.value
    });
  }

  render() {
    if (this.state.isLoaded) {
      return (
        <div>
        <Row>
        <Input s={4} type='select' label="Projects" onChange={this.onChange} defaultValue={this.state.curProject}>
        {Object.keys(this.state.projects).map( k => (
          <option key={k} value={this.state.projects[k]}>{this.state.projects[k]}</option>
        ))}
        </Input>
        </Row>
        <DrugCaseTable project={this.state.curProject}/>
        </div>
      );
    } else {
      return (<Preloader/>)
    }
  }

}
export default App;
