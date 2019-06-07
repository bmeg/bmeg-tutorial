import React, { Component } from 'react'
import Schema from './Schema'
import { connect } from 'react-redux'
import Sidebar from 'react-sidebar-width'
import Results from './Results'

export class Home extends Component {
  sidebarWidth(element) {
    const width = element.target.clientWidth
    const { dispatch } = this.props
    dispatch({
      type: 'LAYOUT_COMPONENTS',
      width: width,
    })
  }

  render() {
    const sidebar = <Results schema={this.props.schema} search={this.props.search} />
    const styles = {
      root: {
        marginTop: '5em',
      }
    }
    return (
      <div className="page-home">
        <Sidebar styles={styles} sidebar={sidebar} open={true} docked={true} onTransitionEnd={this.sidebarWidth.bind(this)} sidebarClassName='sidebar-container'>
        <Schema width={1000} height={400} offset={this.props.offset} />
        </Sidebar>
      </div>
    );
  }
}

function mapStateToProps(state, own) {
  return {
    search: state.search,
    schema: state.schema,
    offset: state.sidebarWidth,
  }
}
export default connect(mapStateToProps) (Home)
