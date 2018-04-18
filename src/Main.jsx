import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import * as ActionCreators from './actionCreators';
import { Button, LabeledCheckbox } from './Util';
import SampleNew from './SampleNew';
import SampleLegacy from './SampleLegacy';

const sampleElements = [
  { label: 'New lifecycle methods',    element: <SampleNew/>,   filename: 'SampleNew.js' },
  { label: 'Legacy lifecycle methods', element: <SampleLegacy/>, filename: 'SampleLegacy.js' }
];

const SampleSelector = ({value, onChange}) => (
  <select value={value} onChange={onChange}>
    { sampleElements.map(({label}, ix) =>
        <option value={ix} key={ix}>{label}</option>
      )
    }
  </select>
);

class Main extends Component {
  state = {
    isShowingParent: true
  }

  onCheckboxChange = (evt) => {
    this.setState({
      isShowingParent: evt.currentTarget.checked
    });
  }

  onSelectSample = (evt) => {
    this.props.setSelectedSample(+evt.currentTarget.value);
    this.props.clearLog();
  }

  render() {
    const selectedSample = sampleElements[this.props.selectedSample];
    return (
      <div className='main'>
        <div className='header'>
          <Button value='forceUpdate' onClick={() => this.forceUpdate()}/>
          <LabeledCheckbox
            label='Show element'
            checked={this.state.isShowingParent}
            onChange={this.onCheckboxChange}
          />
          <span>
            {'Sample: '}
            <SampleSelector
              value={this.props.selectedSample}
              onChange={this.onSelectSample}
            />
          </span>
          <a
            href={`https://stackblitz.com/edit/react-lifecycle-visualizer?file=${selectedSample.filename}`}
            target='_blanc'
          >edit source
          </a>
        </div>
        <div className='traced-component'>
          { this.state.isShowingParent && this.props.selectedSample < sampleElements.length &&
            selectedSample.element
          }
        </div>
      </div>
    );
  }
}

export default connect(({selectedSample}) => ({selectedSample}), ActionCreators)(Main);
