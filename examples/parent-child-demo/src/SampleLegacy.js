/* eslint arrow-body-style: 0, react/no-multi-comp: 0, no-unused-vars: [1, { "args": "none" }] */
import React, { Component } from 'react';
import { traceLifecycle } from 'react-lifecycle-visualizer';

import { Button, LabeledCheckbox, Tagged } from './Util';

@traceLifecycle
export default class OldParent extends Component {
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

  componentWillMount() {
    this.trace('Don\'t use componentWillMount!');
  }

  render() {
    return (
      <Tagged name='OldParent'>
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
        <this.LifecyclePanel/>
        <OldChild incX={this.incX} x={this.state.x}/>
        { this.state.showLastChild &&
            <OldChild incX={this.incX} x={this.state.x}/> }
      </Tagged>
    );
  }
}

@traceLifecycle
class OldChild extends Component {
  state = {
    y: 1,
    squaredX: this.props.x ** 2
  }

  incY = () => {
    this.setState((prevState) => {
      return {y: prevState.y + 1};
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({squaredX: nextProps.x ** 2});
  }

  render() {
    return (
      <Tagged name='OldChild' showProps={{x: this.props.x}}>
        <div>state = {JSON.stringify(this.state)}</div>
        <div>
          <Button value='forceUpdate' onClick={() => this.forceUpdate()}/>
          <Button value='inc x'       onClick={() => this.props.incX()}/>
          <Button value='inc y'       onClick={() => this.incY()}/>
          <Button value='inc x & y'   onClick={() => { this.incY(); this.props.incX(); }}/>
        </div>
        <this.LifecyclePanel/>
      </Tagged>
    );
  }
}
