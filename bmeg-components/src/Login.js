import { render } from 'react-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as _ from 'underscore'

import SplitPane from 'react-flex-split-pane';
import classnames from 'classnames';

import { withStyles } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Card, { CardContent, CardHeader, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';

import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';

import List from 'material-ui/List';

export class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const _self = this;
    return (
      <Button>Hello</Button>
    )
  }
}

function mapStateToProps(state, own) {
  return {}
}

export default connect(mapStateToProps) (Login);
