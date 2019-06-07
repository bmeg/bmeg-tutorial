import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as _ from 'underscore'

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';

import MobileStepper from 'material-ui/MobileStepper';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Plot from './Plot'
import Venn from './Venn'
import QueryMenu from './QueryMenu'

class CohortChooser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      a: undefined, // props.queries[0].key,
      b: undefined, // props.queries[0].key,
    };

    //TODO - we shouldn't need to do these bindings
    // `() =>` syntax should remove the need for it
    // for some reason, this is a syntax error. is it a webpack config issue?
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  handleNext() {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };

  handleBack(){
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return 'Select another query... (//TODO)';
      case 1:
        return 'View plot below';
      case 2:
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  chooseQuery(which, query) {
    const { dispatch } = this.props
    const chosen = _.pick(this.state, ['a', 'b'])
    chosen[which] = query
    this.setState({[which]: query})

    const { a, b } = chosen
    if (a && b) {
      dispatch({type: 'QUERY_COMPARISON', queries: [a, b]})
    }
  }

  render() {
    const { dispatch } = this.props
    const classes = this.props.classes;
    const self = this
    var plot
    if (this.state.activeStep==1) {
      plot = (<Plot open={true}/>)
    }

    const options = _.map(this.props.queries[this.props.label], function(query) {
      return query.key
    })

    return (
      <div className={classes.root}>
        <Paper square className={classes.header} style={{marginBottom:0}}>
          <div style={{width:'100%'}}>
            <Typography type="headline" gutterBottom align="center">
              Compare
            </Typography>
        <QueryMenu
      title={"First query"}
      options={options}
      chooseQuery={(query) => self.chooseQuery('a', query)}
        />
        <QueryMenu
      title={"Second query"}
      options={options}
      chooseQuery={(query) => self.chooseQuery('b', query)}
        />
        <Venn comparison={this.props.comparison} />
      </div>
        </Paper>
        {plot}
      </div>
    );
  }
}

const theme = createMuiTheme()
const styles = {}

// const styles = theme => ({
//   root: {
//     flexGrow: 1,
//   },
//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     height: 50,
//     paddingLeft: theme.spacing.unit * 4,
//     marginBottom: 20,
//     background: theme.palette.background.default,
//   },
// });

CohortChooser.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state, own) {
  return {
    comparison: state.comparison,
    queries: state.queries,
  }
}
export default connect(mapStateToProps) (withStyles(styles) (CohortChooser))


            // <Typography type="title" gutterBottom align="left">
            //   {this.getStepContent(this.state.activeStep)}
            // </Typography>
        // <MobileStepper
        //   style={{clear:'left'}}
        //   type="text"
        //   steps={2}
        //   position="static"
        //   activeStep={this.state.activeStep}
        //   className={classes.mobileStepper}
        //   onBack={this.handleBack}
        //   onNext={this.handleNext}
        //   disableBack={this.state.activeStep === 0}
        //   disableNext={this.state.activeStep === 1}
        // />
