import React, { Component } from 'react';

import * as _ from 'underscore';

import {gripql} from "./gripql.js"

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Slider from '@material-ui/lab/Slider';


import {
  VictoryPie,
  VictoryChart,
  VictoryBar,
  Bar,
  VictoryLabel
} from 'victory';


// From: https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

export class Facet extends Component {

    constructor(props) {
      super(props);
      /* initial state, open if values selected */
      this.state = {
        config: props.config,
        items: []
      };
      this.runQuery = this.runQuery.bind(this)
    }

    runQuery() {
      var q = this.state.config.getData( gripql.query(this.state.config.graph) )
      q.call().then( x => {
        var facetData = this.state.config.facets.map( facet => {
          var items = x.map( i => i.vertex.data[facet.field] )
          .reduce( (a,b) => {
            if(b !== null && typeof b !== 'undefined') {
              if (!a.hasOwnProperty(b)) { a[b] = 1; } else { a[b]++ }
            }
            return a;
          }, {} )
          console.log(items)
          return {
            mode: facet.mode,
            data: items
          }
        })

        this.setState({
          config: this.state.config,
          items: facetData
        })
      })
    }


    componentDidMount() {
      this.runQuery()
    }

    handleSelectChange() {

    }


    // render the facets
    render() {

      const _self = this ;

      //const classes = useStyles();
      var style = {
        width: '100%',
        maxWidth: 360,
      };

      return (
        <div>
          { this.state.items.map(facet => {
              if (facet.mode == 'list') {
                return (
                  <List style={style} dense={true}>
                  { Object.keys(facet.data).map( value => {
                    const labelId = `checkbox-list-label-${value}`;
                    return (
                          <ListItem key={value} role={undefined} dense button >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={false}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value} />
                          </ListItem>
                        );
                      })
                    }
                  </List>
                );
              } else if (facet.mode == 'histogram') {
                return (
                  <div style={{ width: "250px"}}>
                  <VictoryChart domainPadding={20}>
                    <VictoryBar
                      barWidth={2}
                      style={{
                        data: { fill: "#c43a31" }
                      }}
                      data={Object.values(facet.data)}
                    />
                  </VictoryChart>
                  <Slider
                    style = {{ margin: "25px", width: "200px" }}
                    value={100}
                    onChange={this.handleSelectChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                  />
                  </div>
                )
              } else {
                return (<div/>)
              }
            })
          }
          </div>
        );
    }

}
