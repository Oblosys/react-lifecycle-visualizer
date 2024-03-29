/* eslint arrow-body-style: 0, max-classes-per-file: 0, no-unused-vars: [1, { "args": "none" }] */
/* eslint react/no-deprecated: 0 */
import React, { Component } from 'react';
import { traceLifecycle } from 'react-lifecycle-visualizer';

import SimpleButton from '../components/SimpleButton';
import LabeledCheckbox from '../components/LabeledCheckbox';
import Tagged from '../components/Tagged';

@traceLifecycle
class Parent extends Component {
  state = {
    showLastChild: true,
    x: 42
  };

  onCheckboxChange = (evt) => {
    this.setState({
      showLastChild: evt.currentTarget.checked
    });
  };

  incX = () => {
    this.props.trace('Custom message, calling incX');
    this.setState(({x}) => {
      return {x: x + 1};
    });
  };

  componentWillMount() {
    this.props.trace('Don\'t use componentWillMount!');
  }

  render() {
    return (
      <Tagged name='Parent'>
        <div>state = {JSON.stringify(this.state)}</div>
        <div className='controls'>
          <SimpleButton value='forceUpdate' onClick={() => this.forceUpdate()}/>
          <SimpleButton value='inc x'       onClick={this.incX}/>
          <LabeledCheckbox
            label='showLastChild'
            checked={this.state.showLastChild}
            onChange={this.onCheckboxChange}
          />
        </div>
        <this.props.LifecyclePanel/>
        <Child incX={this.incX} x={this.state.x}/>
        { this.state.showLastChild &&
            <Child incX={this.incX} x={this.state.x}/> }
      </Tagged>
    );
  }
}

@traceLifecycle
class Child extends Component {
  state = {
    y: 1,
    squaredX: this.props.x ** 2
  };

  incY = () => {
    this.setState((prevState) => {
      return {y: prevState.y + 1};
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({squaredX: nextProps.x ** 2});
  }

  render() {
    return (
      <Tagged name='Child' showProps={{x: this.props.x}}>
        <div>state = {JSON.stringify(this.state)}</div>
        <div className='controls'>
          <SimpleButton value='forceUpdate' onClick={() => this.forceUpdate()}/>
          <SimpleButton value='inc x'       onClick={() => this.props.incX()}/>
          <SimpleButton value='inc y'       onClick={() => this.incY()}/>
          <SimpleButton value='inc x & y'   onClick={() => { this.incY(); this.props.incX(); }}/>
        </div>
        <this.props.LifecyclePanel/>
      </Tagged>
    );
  }
}

export default Parent;
