import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

function renderInput(inputProps) {
  const { classes, home, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={home}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.key, query);
  const parts = parse(suggestion.key, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={index} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={index} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.key ; // label;
}

// function getSuggestions(value) {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;
//   let count = 0;
//
//   return inputLength === 0
//     ? []
//     : suggestions.filter(suggestion => {
//         const keep =
//           count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;
//
//         if (keep) {
//           count += 1;
//         }
//
//         return keep;
//       });
// }

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'absolute',
    zIndex: 100
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: 'lightgrey',
    left: 0,
    right: 0,

  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    overflow: 'visible'
  },
  textField: {
    width: '100%',
  },
});

class FacetAutosuggest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleSuggestionsFetchRequested.bind(this);
    this.handleSuggestionsClearRequested.bind(this);
    this.handleChange.bind(this);
    this.onKeyUp.bind(this);
    this.triggerChange.bind(this);
  }




  handleSuggestionsFetchRequested({value}) {
    const {dispatch} = this.props;
    const _self = this;
    this.setState({loading:true})
    dispatch({
      type: 'AUTOCOMPLETE',
      label: _self.props.property,
      value: value
    })
  };

  handleSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  };

  // tell caller
  triggerChange(newValue) {
    this.props.onSelect(newValue)
  }
  // enter, tell caller
  onKeyUp(target) {
    if ( target.keyCode == 13 ) {
      this.triggerChange(this.state.value)
    }
  };
  // clicks, tell caller
  handleChange(event,{newValue, method}) {
    this.setState({
      value: newValue,
    });
    if (method !== 'type') {
      this.triggerChange(newValue)
    }
  };

  render() {
    const { classes } = this.props;
    const placeholder = `Search ${this.props.property}`
    return (
      <div style={{marginBottom: 50}}>
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={renderInput}
          suggestions={this.props.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested.bind(this)}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested.bind(this)}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            autoFocus: true,
            classes,
            placeholder: placeholder,
            value: this.state.value,
            onChange: this.handleChange.bind(this),
            onKeyUp: this.onKeyUp.bind(this),
          }}
        />
      </div>
    );
  }
}

FacetAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state, own) {
  var suggestions = []
  if (state.autocomplete && state.autocomplete[own.property]) {
    suggestions =  state.autocomplete[own.property].buckets || []
  }
  return {
    suggestions: suggestions,
  }
}

export default connect(mapStateToProps) (withStyles(styles) (FacetAutosuggest));
