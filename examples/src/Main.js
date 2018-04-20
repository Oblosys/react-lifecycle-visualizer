/* global sessionStorage:false */
import React, { Component } from 'react';
import { clearLog } from 'react-lifecycle-visualizer';

import { Button, LabeledCheckbox } from './Util';
import SampleNew from './SampleNew';
import SampleLegacy from './SampleLegacy';

const sampleElements = [
  { label: 'New lifecycle methods',    element: <SampleNew/>,   filename: 'SampleNew.js' },
  { label: 'Legacy lifecycle methods', element: <SampleLegacy/>, filename: 'SampleLegacy.js' }
];

const sessionStorageKey = '@@react-lifecycle-visualizer-demo--persistent-state:';
export const sessionSelectedSampleIxKey = sessionStorageKey + 'selectedSampleIx';
const sessionSelectedSampleIx = sessionStorage.getItem(sessionSelectedSampleIxKey);

const SampleSelector = ({value, onChange}) => (
  <select value={value} onChange={onChange}>
    { sampleElements.map(({label}, ix) =>
        <option value={ix} key={ix}>{label}</option>
      )
    }
  </select>
);

export default class Main extends Component {
  state = {
    selectedSampleIx: sessionSelectedSampleIx ? +sessionSelectedSampleIx : 0,
    isShowingParent: true
  }

  onCheckboxChange = (evt) => {
    this.setState({
      isShowingParent: evt.currentTarget.checked
    });
  }

  onSelectSample = (evt) => {
    const selectedSampleIx = +evt.currentTarget.value;
    this.setState({selectedSampleIx});
    sessionStorage.setItem(sessionSelectedSampleIxKey, selectedSampleIx);
    clearLog();
  }

  render() {
    const selectedSample = sampleElements[this.state.selectedSampleIx];
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
              value={this.state.selectedSampleIx}
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
          { this.state.isShowingParent &&
            selectedSample.element
          }
        </div>
      </div>
    );
  }
}
