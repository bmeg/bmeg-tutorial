import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from "react-redux";


import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import SearchIcon from 'material-ui-icons/Search'
import { grey, yellow, green, red } from 'material-ui/colors'

import CodeMirror from 'react-codemirror'
require('codemirror/mode/solr/solr');
// see main.scss for inclusion and overrides

import ReactTooltip from 'react-tooltip'
import Parser from 'lucene-query-parser';
import * as _ from 'underscore'

export class Search extends Component {

  constructor(props) {
    super(props)
    this.state = {
      timeout: null,
      dirty: false,
      lastFacet: null,
      componentLoading:true
    }
    this.debounceInterval = 500;
    this.autocomplete = this.autocomplete.bind(this);
    this.getHints  = this.getHints.bind(this);
    this.onEnter = this.onEnter.bind(this);
    // this.showParserError = this.showParserError.bind(this);
    this.lastQueryString = null;
  }


  // fire search event, if it has changed
  triggerSearch(value, parsedQuery, supressFacetAggregation=true, focus=this.props.focus) {
    const {dispatch} = this.props;
    if (this.lastQueryString === value && supressFacetAggregation) {
      return
    }
    this.lastQueryString = value;
    const _self = this;
    _self.setState({dirty:false})
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'SEARCH',
        focus: focus,
        label: focus,
        queryString: value,
        parsedQuery: parsedQuery,
        supressFacetAggregation: supressFacetAggregation,
        callbackError: (error) => {
          reject({_error: error});
        },
        callbackSuccess: () => {
          resolve();
        }
      });
    });
  }

  // update state when search updated by typing
  handleChange(value) {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
      this.setState({timeout: null});
    }

    var self = this;
    var timeout;
    var isDirty = true;
    var newQuery = value
    var parserError = undefined
    var parsedQuery;
    try {
      parsedQuery = Parser.parse(value)
      newQuery = this.stringifyQuery(parsedQuery)
    } catch (e) {
      parserError = e
    }
    // if (!this.state.dirty && !parserError) {
    //   timeout = setTimeout(function() {self.triggerSearch(newQuery, parsedQuery, true)}, this.debounceInterval)
    // }
    this.setState({text: newQuery,
                   timeout: timeout,
                   dirty:isDirty,
                   parsedQuery: parsedQuery,
                   parserError:parserError})
  }

  // if user clicked query icon or hit enter key, update facets too
  onEnter(cm) {
    if (this.state.parserError) {
      alert('Please correct query!')
      return
    }
    this.updateFacets()
    this.triggerSearch(this.state.text, this.state.parsedQuery, false);
  }

  // check if facets need updating
  updateFacets() {
    const {focus} = this.props;
    const fieldsAndTerms = this.getFieldsAndTerms(this.state.parsedQuery)
    const selectedFacets = this.props.currentQuery[focus].selectedFacets || []
    const facetsNeedUpdate = _.filter(fieldsAndTerms, (fieldTerm) => {
      return  _.find(selectedFacets, (f) => {
        return f.key === fieldTerm.key && !_.isEqual(f.value, fieldTerm.term)
      })
    })
    const { dispatch } = this.props;
    var updatedFacets = []
    _.each(facetsNeedUpdate, (fieldTerm) => {
      _.each(selectedFacets, (f) => {
        if (f.key === fieldTerm.key) {
          updatedFacets.push({
            ...f,
            value: fieldTerm.term,
          })
        }
      })
    })
    _.each(updatedFacets, (f) => {
      dispatch({
        type: 'SELECTED_FACET',
        facet: f
      })
    })
  }

  // set up our call back, etc for autocompletion of CodeMirror component
  componentDidMount() {
    const { dispatch } = this.props;

    let cm = this.refs['editor'].getCodeMirrorInstance();
    let editor = this.refs['editor'].getCodeMirror();
    const _self = this;

    // // set gutterClick
    //  editor.on("gutterClick", function(cm, n) {
    //    _self.showParserError()
    //  });

    // see CodeMirror's anyword-hint for background
    let showHint = require('./show_hint');
    showHint(cm);
    // when auto suggesting, look for words that include . _
    var WORD = /([\u4e00-\u9fa5]|[a-zA-Z]|[\._])+/;
    cm.registerHelper("hint", "tag", function (editor, options) {
      var word = options && (options.word || WORD);
      // var range = options && (options.range || RANGE);
      var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
      var end = cur.ch, start = end;
      while (start && word.test(curLine.charAt(start - 1)))--start;
      var curWord = start !== end && curLine.slice(start, end);

      var list = []
      var data = editor.options.hints(); // set in render, grab from current responses
      for (var k in data){
        if (data.hasOwnProperty(k) ) {
          if (!curWord) {
            list.push(k);
            list.push(data[k]);
          } else if (k.startsWith(curWord)) {
            list.push(k);
          }
          //  else if (data[k].startsWith(curWord)) {
          //    list.push(data[k]);
          //  }
        }
      }
      list.sort()
      return { list: list, from: cm.Pos(cur.line, start), to: cm.Pos(cur.line, end) };
    });
  }

  // when user hits 'Ctrl-Space'
  autocomplete(cm) {
    let codeMirror = this.refs['editor'].getCodeMirrorInstance();
    codeMirror.showHint(cm, codeMirror.hint.tag);
  }

  // hints used by codeMirror autocomplete
  getHints() {
    const {resources} = this.props;
    return this.props.facets;
  }

  //  // click event from codemirror gutter
  //  showParserError() {
  //    alert(this.state.parserError)
  //  }

  // this is a bit tweaky, but we manage state of codemirror
  // and its interaction with facets here, not in mapStateToProps
  // this allows us to maintain cursor position, etc.
  //  // click event from codemirror gutter
  //  showParserError() {
  //    alert(this.state.parserError)
  //  }

  // this is a bit tweaky, but we manage state of codemirror
  // and its interaction with facets here, not in mapStateToProps
  // this allows us to maintain cursor position, etc.
  componentWillReceiveProps(nextProps) {
    const _self = this ;
    if (this.state.componentLoading) {
      this.setState({componentLoading:false})
      return
    }
    const currentFacetString = function()  {
      if (!nextProps.currentFacet) {
        return
      }
      if (!nextProps.facets[nextProps.currentFacet.key]) {
        return
      }
      if (_self.state.lastFacet ===  nextProps.currentFacet.key) {
        return
      }
      const type = nextProps.facets[nextProps.currentFacet.key].type;
      var str
      if (type === 'text') {
        str = `${nextProps.currentFacet.key}:"${nextProps.currentFacet.value}"`;
      } else {
        str =`${nextProps.currentFacet.key}:${nextProps.currentFacet.value}`;
      }
      return _self.stringifyQuery(Parser.parse(str))
    }

    // check that a real update happened
    var facetChanged = false;
    var focusChanged = false;
    var stringChanged = false;
    var queryText;
    var parserError;
    var parsedQuery;

    if (!nextProps.schema.vertexes) {
      return
    }
    if (nextProps.currentFacet.key) {
      if (_self.state.lastFacetKey !==  nextProps.currentFacet.key) {
        facetChanged = true;
      }
      if (_self.state.lastFacetValue !==  nextProps.currentFacet.value) {
        facetChanged = true;
      }
    }

    const focal = nextProps.currentQuery[nextProps.focus]
    if (focal && _self.getText() !== focal.queryString) {
      facetChanged = true;
      stringChanged = true;
    }

    if (!nextProps.queryState.restore && nextProps.focus !== _self.props.focus) {
      facetChanged = true;
      focusChanged = true;
    }

    if (focusChanged) {
      queryText = focal.queryString || ''
      this.replaceText(queryText)
      this.triggerSearch(queryText, Parser.parse(queryText), false, nextProps.focus)
      console.log('focusChanged', queryText)
    } else if (facetChanged) {
      try {
        var currentParsedQuery = Parser.parse(_self.getText() || nextProps.text || '')
        const replaced = this.replaceTerm(currentParsedQuery, nextProps.currentFacet.key, nextProps.currentFacet.value)
        if (!replaced) {
          const cf = currentFacetString();
          queryText = this.insertTextAtCursor(` ${cf} `);
        } else {
          queryText = this.stringifyQuery(currentParsedQuery);
        }
        currentParsedQuery = Parser.parse(queryText)
        queryText = this.stringifyQuery(currentParsedQuery)
        this.replaceText(queryText)
        this.triggerSearch(queryText, currentParsedQuery)
      } catch (e) {
        parserError = e
        queryText = queryText
      }
    }
    if (queryText) {
      this.setState({
        text:queryText,
        parsedQuery: currentParsedQuery,
        parserError:parserError,
        lastFacetKey: nextProps.currentFacet.key,
        lastFacetValue: nextProps.currentFacet.value,
      })
    }
  }



  // codemirror util: ... insert it into the search bar at the current cursor
  insertTextAtCursor(text) {
    //  if (!text) { return }
    if (!this.refs['editor'])  { return }
    let editor = this.refs['editor'].getCodeMirror();
    var doc = editor.getDoc();
    var cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
    return editor.getValue()
  }

  // codemirror util: ... replace search bar, place cursor at end
  replaceText(text) {
    if (!this.refs['editor'])  { return }
    let editor = this.refs['editor'].getCodeMirror();
    var doc = editor.getDoc();
    var oldCursor = doc.getCursor();
    editor.setValue(text);
    editor.setCursor({line: 1, ch: text.length})
    var cursor = doc.getCursor();
    return editor.getValue()
  }

  // codemirror util: ... get search bar text
  getText() {
    if (!this.refs['editor'])  { return }
    let editor = this.refs['editor'].getCodeMirror();
    return editor.getValue()
  }

  // lucene query util: PreOrderTraversal parsed query, replace field term , return true on replace
  replaceTerm(root, field, term) {
    // hack: replace an existing vector with a term, see stringify array handling
    if (root.field === field) {
      root.term = term;
      delete root.left
      delete root.right
      return true
    }
    var replaced = false ;
    if (root.left) {
      replaced = this.replaceTerm(root.left, field, term);
    }
    if (!replaced && root.right) {
      replaced = this.replaceTerm(root.right, field, term);
    }
    return replaced;
  }

  // lucene query util: PreOrderTraversal parsed query, return field term
  getTerm(root, field, memo = []) {
    if (root.field === field) {
      return  this.getTermContent(root, memo)
    }
    var replaced = false ;
    if (root.left) {
      memo = this.getTerm(root.left, field, memo);
    }
    if (!replaced && root.right) {
      memo = this.getTerm(root.right, field, memo);
    }
    return memo;
  }

  // lucene query util: get all the terms under this element
  getTermContent(root, memo) {
    if (root.term) {
      return memo.concat([root.term])
    }
    if (root.left) {
      memo = this.getTermContent(root.left, memo);
    }
    if (root.right) {
      memo = this.getTermContent(root.right, memo);
    }
    return memo;
  }

  // lucene query util: return all the fields in the query
  getFields(root, memo=[]) {
    if (root.field) {
      return memo.concat([root.field])
    }
    if (root.left) {
      memo = this.getFields(root.left, memo);
    }
    if (root.right) {
      memo = this.getFields(root.right, memo);
    }
    return memo;
  }

  // lucene query util: return all the fields in the query, with associated terms
  getFieldsAndTerms(root, memo=[]) {
    const fields = this.getFields(root);
    return fields.map((f) => {
      return { key:f, term: this.getTerm(root,f) }
    }) ;
  }

   // lucene query util: PreOrderTraversal parsed query, recreate query string
   stringifyQuery(root,str = '') {
     // util funcs
     var quote = (s) => {
       const specialChars = [ ':', ' ', '-', '+']
       const found = _.find(specialChars, (c) => {return s.indexOf(c) > -1})
       if (found) {
         return `"${s}" `
       }
       return `${s} `
     }
     var isEmptyArray = (t) => {
       return (Array.isArray(t) && t.length === 0)
     }

     // process tree
     // simple field
     if (root.field && root.field !== '<implicit>' && !isEmptyArray(root.term) ) {
       str = str.concat(`${root.field}:`)
     }
     // simple term, quote if it has blanks or embedded colon
     if (root.term) {
       if (Array.isArray(root.term) && !isEmptyArray(root.term) ) {
         str = str.concat(['(',
                          _.map(root.term, (t) => { return quote(t) }).join(' ')
                          , ')'].join(''))
       } else {
         str = str.concat(quote(root.term))
       }
     }
     // explicit operator, surround with parenthesis
     if (root.operator && root.operator !== '<implicit>') {
       str = str.concat(`(`)
     }
     // vector start, surround with parenthesis
     if (root.field && root.field !== '<implicit>' && root.operator && root.left && root.operator === '<implicit>') {
       str = str.concat(`(`)
     }
     // recurse left tree
     if (root.left) {
       str =   this.stringifyQuery(root.left,str)
     }
     // explicit operator
     if (root.operator && root.operator !== '<implicit>') {
       str = str.concat(` ${root.operator} `)
     }
     // recurse right tree
     if (root.right) {
       str = this.stringifyQuery(root.right,str);
     }
     // vector end, terminate parenthesis
     if (root.field && root.field !== '<implicit>' && root.operator && root.left && root.operator === '<implicit>') {
       str = str.concat(`)`)
     }
     // explicit operator end, terminate parenthesis
     if (root.operator && root.operator !== '<implicit>') {
       str = str.concat(`)`)
     }
     return str
   }

  render() {
    const props = this.props;
    const _self = this;
    // // display error if parse error, see showParserError()
    // var gutters = ['CodeMirror-ok'];
    // if (this.state.parserError) {
    //   gutters = ['CodeMirror-error']
    // }

    var options = {
      mode: 'solr',
      autofocus: false, // not that it's lowercase, from the CodeMirror Docs
       extraKeys: {
         'Enter': this.onEnter,
         'Ctrl-Space': this.autocomplete,
         'Tab': false,
       },
      hints: this.getHints,
      // gutters: gutters
    };

    var iconColor
    var iconTooltip
    if (this.state.parserError) {
      iconColor = 'red'
      iconTooltip = this.state.parserError.message
    } else {
      iconColor = _self.state.dirty ? 'yellow' : 'green'
      iconTooltip = _self.state.dirty ? 'Refresh Needed' : 'Query OK'
    }

    return (
        <Paper
          style={{ width:'100%',
                   height: 48,
                   display: 'flex',
                   marginLeft: '8px',
                   justifyContent: 'space-between' }}
          >
          <div style={{ margin: 'auto 8px', width: '100%' }}>
            <CodeMirror ref="editor"
                        name="editor"
                        value={this.state.text}
                        onChange={this.handleChange.bind(this)}
                        options={options}
                        />
          </div>
          <IconButton style={{
              transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
              borderRadius: 'inherit',
              backgroundColor: 'lightgrey'
            }}
            onTouchTap={this.onEnter}
            data-tip
            data-for='DIRTY_QUERY'
            >
            <SearchIcon style={{color:iconColor}} />
          </IconButton>
          <ReactTooltip id='DIRTY_QUERY' type="info">
            <span>{iconTooltip}</span>
          </ReactTooltip>
        </Paper>
    )
  }
}

function mapStateToProps(state, own) {

  console.log('state.currentQuery',state.currentQuery)
  const currentFocus = state.currentQuery[state.currentQuery.focus]
  var text = own.text, currentFacet = {}, selectedFacets = []
  if (currentFocus) {
    text = currentFocus.queryString ? currentFocus.queryString : '' ;
    currentFacet = currentFocus.currentFacet ? currentFocus.currentFacet : {};
    selectedFacets = currentFocus.selectedFacets ? currentFocus.selectedFacets : [];
  }

  return {
    queryState: state.queryState,
    focus: state.currentQuery.focus,
    facets: state.facets,
    selectedFacets: selectedFacets,
    currentFacet: currentFacet,
    schema: state.schema,
    path: state.path,
    currentQuery: state.currentQuery,
    text: text,
  };
}
export default connect(mapStateToProps) (Search);
