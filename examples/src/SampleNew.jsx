/* eslint arrow-body-style: 0, react/no-multi-comp: 0, no-unused-vars: [1, { "args": "none" }] */
import * as React from 'react';
import { Component } from 'react';
import { traceLifecycle } from '../../src/index';

import { Button, LabeledCheckbox, Tagged } from './Util';

@traceLifecycle
export default class Parent extends Component {
  state = {
    showLastChild: true,
    x: 42
  }

  onCheckboxChange = (evt) => {
    this.setState({
      showLastChild: evt.currentTarget.checked
    });
  }

  incX = () => {
    this.trace('Custom message, calling incX');
    this.setState(({x}) => {
      return {x: x + 1};
    });
  }

  render() {
    return (
      <Tagged name='Parent'>
        <div>state = {JSON.stringify(this.state)}</div>
        <div>
          <Button value='forceUpdate' onClick={() => this.forceUpdate()}/>
          <Button value='inc x'       onClick={this.incX}/>
          <LabeledCheckbox
            label='showLastChild'
            checked={this.state.showLastChild}
            onChange={this.onCheckboxChange}
          />
        </div>
        { this.lifecyclePanel }
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
    y: 1
  }

  incY = () => {
    this.setState((prevState) => {
      return {y: prevState.y + 1};
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {squaredX: nextProps.x ** 2};
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    return (
      <Tagged name='Child' showProps={{x: this.props.x}}>
        <div>state = {JSON.stringify(this.state)}</div>
        <div>
          <Button value='forceUpdate' onClick={() => this.forceUpdate()}/>
          <Button value='inc x'       onClick={() => this.props.incX()}/>
          <Button value='inc y'       onClick={() => this.incY()}/>
          <Button value='inc x & y'   onClick={() => { this.incY(); this.props.incX(); }}/>
        </div>
        { this.lifecyclePanel }
      </Tagged>
    );
  }
}
