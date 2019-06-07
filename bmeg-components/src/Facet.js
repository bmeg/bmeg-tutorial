import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from "react-redux"
import { push } from 'react-router-redux'
import * as _ from 'underscore'


import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card, { CardContent } from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';

import FacetAutosuggest from './FacetAutosuggest'

import {
  VictoryPie,
  VictoryChart,
  VictoryBar,
  Bar,
  VictoryLabel
} from 'victory';

// a `cohort` is a selection from a type/domain/label based on selected criteria
export class Facet extends Component {

  constructor(props) {
    super(props);
    /* initial state, open if values selected */
    this.state = {
      open: props.open,
      values: props.values,
    };
    this.toggleOpen = this.toggleOpen.bind(this)
    this.onFacetValueSelected = this.onFacetValueSelected.bind(this)
  }

  // when user (un)selects a value
  onFacetValueSelected(key, value) {
    if (!value) {
      return
    }
    const { dispatch } = this.props
    const type = this.props.facet.type;
    const property = key.split('.')[1]
    var newValues = this.state.values
    if (newValues.includes(value)) {
      newValues = _.without(newValues, value)
    } else {
      newValues = newValues.concat(value)
    }
    this.setState({
      values: newValues
    },() => {
      dispatch({
        type: 'SELECTED_FACET',
        facet: {
          label: this.props.label,
          key: key,
          property: property,
          value: this.state.values,
          type: type,
        }
      })
    });
  }

  toggleOpen() {
    this.setState({
      open: !this.state.open
    });
  }

  updateTextInput(textInput) {
    this.setState({textInput: textInput})
  }


  updateNumericInput(numericInput) {
    this.setState({numericInput: numericInput})
  }

  // render the facets
  render() {

    const _self = this ;

    const facet = this.props.facet;
    const key = this.props.property;
    const classes = this.props.classes;


    //  different aggregations have different structures, normalize it for
    //  the chart
    var value_accessor ;
    if (facet.buckets.length  > 0) {
        value_accessor = facet.buckets[0].doc_count ? 'doc_count' : 'value';
    }

    // compose bucket list for the facet
    var buckets = _.map(facet.buckets, function(bucket) {
      return (
            <li key={bucket.key}
              onClick={ () => {
                  if (bucket.doc_count) {
                    _self.updateTextInput(bucket.key)
                    _self.onFacetValueSelected(key, bucket.key)
                  } else {
                    _self.updateNumericInput(bucket.value);
                    _self.onFacetValueSelected(key, bucket.value)
                  }
                }
              }
              className="list-group-item">
              {bucket.key}
              <span className="badge">{bucket.doc_count ? bucket.doc_count : bucket.value}</span>
            </li>
          );
    });
    // if we have 'remainder', compose 'other' pseudo bucket
    var other;
    if (facet.sum_other_doc_count > 0) {
      other = <li key={'other'} className="list-group-item" ><em>{'other'}</em> <span className="badge">{facet.sum_other_doc_count}</span></li> ;
    }

    // compose chart
    // padding for chart container
    const chartWellStyles = {padding:'0 0 0 0'}
    // char is either pie or chart ( more in future)
    var chart ;
    // input is either numeric text field or null
    var input ;
    if (this.state.open) {
      // percentile aggregation
      if (value_accessor === 'value') {
        input = (
          <TextField
             margin="dense"
             placeholder="123..."
             label="Value"
             helperText="Numeric"
             autoFocus
             value={_self.state.numericInput || '' }
             className={classes.input}
             onChange={ (event) => { _self.updateNumericInput(event.target.value) } }
             inputProps={{
               'aria-label': 'Description',
             }}
           />
        ) ;

        chart = (
          <VictoryChart domainPadding={20} >
            <VictoryBar
              data={facet.buckets}
              x={(d) => `${d.key}`}
              y={value_accessor}
              colorScale='warm'
              events={[{
                target: "data",
                eventHandlers: {
                  onClick: (evt, clickedProps) => {
                    _self.onFacetValueSelected(key,clickedProps.datum.y)
                  },
                }
              }]}
              />
          </VictoryChart>
        )
      } else if (value_accessor === 'doc_count') {

        // input = (
        //   <TextField
        //      margin="dense"
        //      placeholder="ABC..."
        //      label="Value"
        //      helperText="Text"
        //      autoFocus
        //      value={_self.state.textInput || '' }
        //      className={classes.input}
        //      onChange={ (event) => { _self.updateTextInput(event.target.value) }}
        //      inputProps={{
        //        'aria-label': 'Description',
        //      }}
        //    />
        // ) ;

        input = (
          <FacetAutosuggest
            property={_self.props.property}
            onSelect= {(v) => {_self.onFacetValueSelected(key,v)}}  />
        ) ;


        // terms aggregation
        chart = (
          <VictoryPie data={facet.buckets}
                      x="key"
                      y={value_accessor}
                      colorScale='warm'
                      style={{ parent: { overflow: "visible" } }}
                      startAngle={45}
              				endAngle={-315}
                      padding={70}
                      events={[{
                        target: "data",
                        eventHandlers: {
                          onClick: (evt, clickedProps) => {
                            _self.onFacetValueSelected(key,clickedProps.datum.x)
                            },
                        }
                      }]}
                      />
        )
      }
      if (!chart) {
        chart = (<p>No values for this query</p>);
      }
      chart = (
        <Paper className="text-center" style={chartWellStyles}>
          {chart}
        </Paper>)
    }


    // all done with this facet, let's render it
    var icon
    if (this.state.open) {
      icon = (<ExpandLessIcon />)
    } else {
      icon = (<ExpandMoreIcon />)
    }

    const facetItem = (
      <div>
        <ListItem dense disableGutters button key={key} onClick={event => _self.toggleOpen()}>
          <ListItemText primary={key}  />
          <ListItemSecondaryAction >
            <IconButton aria-label="More" onClick={event => _self.toggleOpen()}>
              {icon}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={_self.state.open} transitionDuration="auto" unmountOnExit >
          <div>
            {chart}
            {input}
            {buckets}
            {other}
          </div>
        </Collapse>
      </div>
    );

    return facetItem;
  }
}

function mapStateToProps(state, own) {
  // our state
  var selectedFacet = state.facets[own.property];
  var open = false ;
  var values = [];
  const focus = own.property.split('.')[0]
  if (state.currentQuery[focus]) {
    const currentFacets = _.filter(state.currentQuery[focus].selectedFacets,(f) => {return f.value && f.key === own.property })
    open = currentFacets.length === 1
    if (open) {
      values = currentFacets[0].value ;
      if (!Array.isArray(values)) {
        values = [values]
      }
    }
  }

  return {
    selectedFacet: selectedFacet,
    open: open,
    values: values
  }
}

const theme = createMuiTheme();
const styles = {
  card: {
    maxWidth: 400,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  input: {
    width:'100%',
  },
  options: {},
};

export default connect(mapStateToProps) (withStyles(styles)(Facet));
