/* global sessionStorage:false */
import React, { Component } from 'react';
import { clearLog } from 'react-lifecycle-visualizer';

import SimpleButton from './components/SimpleButton';
import LabeledCheckbox from './components/LabeledCheckbox';
import SampleNew from './samples/New';
import SampleLegacy from './samples/Legacy';

const sampleComponents = [
  { label: 'New lifecycle methods',    component: SampleNew,    filename: 'New.js' },
  { label: 'Legacy lifecycle methods', component: SampleLegacy, filename: 'Legacy.js' }
];

const getStackBlitzUrl = (filename) =>
  'https://stackblitz.com/github/Oblosys/react-lifecycle-visualizer/tree/master/' +
  'examples/parent-child-demo?file=src/samples/' + filename;

const sessionStorageKey = '@@react-lifecycle-visualizer-demo--persistent-state:';
export const sessionSelectedSampleIxKey = sessionStorageKey + 'selectedSampleIx';
const sessionSelectedSampleIx = sessionStorage.getItem(sessionSelectedSampleIxKey);

const SampleSelector = ({value, onChange}) => (
  <select value={value} onChange={onChange}>
    { sampleComponents.map(({label}, ix) =>
        <option value={ix} key={ix}>{label}</option>
      )
    }
  </select>
);

export default class Main extends Component {
  state = {
    selectedSampleIx: sessionSelectedSampleIx ? +sessionSelectedSampleIx : 0,
    isShowingParent: true
  };

  onCheckboxChange = (evt) => {
    this.setState({
      isShowingParent: evt.currentTarget.checked
    });
  };

  onSelectSample = (evt) => {
    const selectedSampleIx = +evt.currentTarget.value;
    this.setState({selectedSampleIx});
    sessionStorage.setItem(sessionSelectedSampleIxKey, selectedSampleIx);
    clearLog();
  };

  render() {
    const selectedSample = sampleComponents[this.state.selectedSampleIx];
    const SelectedSample = selectedSample.component;
    return (
      <div className='main'>
        <div className='header'>
          <div>
            <span>
              {'Sample: '}
              <SampleSelector
                value={this.state.selectedSampleIx}
                onChange={this.onSelectSample}
              />
            </span>
            <a href={getStackBlitzUrl(selectedSample.filename)} target='_blanc'>edit source</a>
          </div>
          <div>
            <SimpleButton value='forceUpdate' onClick={() => this.forceUpdate()}/>
            <LabeledCheckbox
              label='Show element'
              checked={this.state.isShowingParent}
              onChange={this.onCheckboxChange}
            />
            <a
              className='github-link'
              target='_blank'
              rel='noopener noreferrer'
              href='https://github.com/Oblosys/react-lifecycle-visualizer#readme'
            >
              GitHub
            </a>
          </div>
        </div>
        <div className='traced-component'>
          { this.state.isShowingParent && <SelectedSample/> }
        </div>
      </div>
    );
  }
}
