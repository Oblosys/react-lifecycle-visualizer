import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { clearLog, resetInstanceIdCounters } from '../src';

import { Wrapper } from './Wrapper';
import TracedChild from './TracedChild';
import TracedLegacyChild from './TracedLegacyChild';
import TracedLegacyUnsafeChild from './TracedLegacyUnsafeChild';

const nNewLifecyclePanelMethods = 9;  // Non-legacy panel has 9 lifecycle methods
const nLegacyLifecyclePanelMethods = 10;  // Legacy panel has 10 lifecycle methods

// Return array of length `n` which is 'true' at index `i` and 'false' everywhere else.
const booleanStringListOnlyTrueAt = (n, i) => Array.from({length: n}, (_undefined, ix) => `${ix === i}`);

const formatLogEntries = (instanceName, logMethods) => logMethods.map((e, i) =>
  ('' + i).padStart(2) + ` ${instanceName}: ` + e // NOTE: padding assumes <=100 entries
);

const setupUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('traceLifecycle', () => {
  it('preserves static properties', () => {
    expect(TracedChild.staticProperty).toBe('a static property');
  });
});

describe('LifecyclePanel', () => {
  it('shows which methods are implemented', () => {
    render(<Wrapper renderChild={() => <TracedChild/>}/>);
    const methods = [...screen.getByTestId('lifecycle-panel').querySelectorAll('.lifecycle-method')];

    methods.forEach((node) => {
      expect(node).toHaveAttribute('data-is-implemented', 'true');
    });
  });

  it('shows new methods for non-legacy component', () => {
    render(<Wrapper renderChild={() => <TracedChild/>}/>);
    const methods = [...screen.getByTestId('lifecycle-panel').querySelectorAll('.lifecycle-method')];

    expect(methods).toHaveLength(nNewLifecyclePanelMethods);
  });

  it('shows legacy methods for legacy component', () => {
    /* eslint-disable no-console */
    // Disable console.warn to suppress React warnings about using legacy methods (emitted once per method).
    const consoleWarn = console.warn;
    console.warn = () => {};
    render(<Wrapper renderChild={() => <TracedLegacyChild/>}/>);
    console.warn = consoleWarn;
    /* eslint-enable no-console */

    const methods = [...screen.getByTestId('lifecycle-panel').querySelectorAll('.lifecycle-method')];

    expect(methods).toHaveLength(nLegacyLifecyclePanelMethods);
  });
});

describe('Log', () => {
  it('sequentially highlights log entries', () => {
    render(<Wrapper renderChild={() => <TracedChild/>}/>);
    act(() => jest.runOnlyPendingTimers()); // log entries are generated asynchronously, so run timers once

    const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    const nLogEntries = entries.length;

    expect(nLogEntries).toBeGreaterThan(0);

    for (let i = 0; i < nLogEntries; i++) {
      expect(entries.map((node) => node.getAttribute('data-is-highlighted'))).toEqual(
        booleanStringListOnlyTrueAt(nLogEntries, i)
      );
      act(() => jest.runOnlyPendingTimers()); // not necessary for last iteration, but harmless
    }
  });

  it('highlights the corresponding panel method', async () => {
    const user = setupUser();
    render(<Wrapper renderChild={() => <TracedChild/>}/>);
    const logEntries = within(screen.getByTestId('log-entries'));
    const panel = within(screen.getByTestId('lifecycle-panel'));
    act(() => jest.runOnlyPendingTimers()); // log entries are generated asynchronously, so run timers once

    expect(panel.getByText('render')).toHaveAttribute('data-is-highlighted', 'false');
    await user.hover(logEntries.getByText('4 Child-1: render'));
    expect(panel.getByText('render')).toHaveAttribute('data-is-highlighted', 'true');

    expect(panel.getByText('constructor')).toHaveAttribute('data-is-highlighted', 'false');
    await user.hover(logEntries.getByText('0 Child-1: constructor'));
    expect(panel.getByText('constructor')).toHaveAttribute('data-is-highlighted', 'true');
  });

  it('logs all new lifecycle methods', async () => {
    const user = setupUser();
    render(<Wrapper renderChild={({prop}) => <TracedChild prop={prop}/>}/>); // Mount TracedChild
    await user.click(screen.getByTestId('prop-value-checkbox'));             // Update TracedChild prop
    await user.click(screen.getByTestId('state-update-button'));             // Update TracedChild state
    await user.click(screen.getByTestId('show-child-checkbox'));             // Unmount TracedChild
    act(() => jest.runOnlyPendingTimers());

    const expectedLogEntries = [
      // Mount TracedChild
      'constructor',
      'custom:constructor',
      'static getDerivedStateFromProps',
      'custom:getDerivedStateFromProps',
      'render',
      'custom:render',
      'componentDidMount',
      'custom:componentDidMount',

      // Update TracedChild prop
      'static getDerivedStateFromProps',
      'custom:getDerivedStateFromProps',
      'shouldComponentUpdate',
      'custom:shouldComponentUpdate',
      'render',
      'custom:render',
      'getSnapshotBeforeUpdate',
      'custom:getSnapshotBeforeUpdate',
      'componentDidUpdate',
      'custom:componentDidUpdate',

      // Update TracedChild state
      'setState',
      'setState:update fn',
      'custom:setState update fn',
      'static getDerivedStateFromProps',
      'custom:getDerivedStateFromProps',
      'shouldComponentUpdate',
      'custom:shouldComponentUpdate',
      'render',
      'custom:render',
      'getSnapshotBeforeUpdate',
      'custom:getSnapshotBeforeUpdate',
      'componentDidUpdate',
      'custom:componentDidUpdate',
      'setState:callback',
      'custom:setState callback',

      // Unmount TracedChild
      'componentWillUnmount',
      'custom:componentWillUnmount',
    ];

    const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    expect(entries.map((node) => node.textContent))
      .toEqual(formatLogEntries('Child-1', expectedLogEntries)
    );
  });

  it('logs all legacy lifecycle methods', async () => {
    const user = setupUser();

    /* eslint-disable no-console */
    // Disable console.warn to suppress React warnings about using legacy methods.
    const consoleWarn = console.warn;
    console.warn = () => {};
    render(<Wrapper renderChild={({prop}) => <TracedLegacyChild prop={prop}/>}/>); // Mount TracedLegacyChild
    console.warn = consoleWarn;
    /* eslint-enable no-console */

    await user.click(screen.getByTestId('prop-value-checkbox'));                   // Update TracedLegacyChild prop
    await user.click(screen.getByTestId('state-update-button'));                   // Update TracedLegacyChild state
    await user.click(screen.getByTestId('show-child-checkbox'));                   // Unmount TracedLegacyChild
    act(() => jest.runOnlyPendingTimers());

    const expectedLogEntries = [
      // Mount TracedLegacyChild
      'constructor',
      'custom:constructor',
      'componentWillMount',
      'custom:componentWillMount',
      'render',
      'custom:render',
      'componentDidMount',
      'custom:componentDidMount',

      // Update TracedLegacyChild prop
      'componentWillReceiveProps',
      'custom:componentWillReceiveProps',
      'shouldComponentUpdate',
      'custom:shouldComponentUpdate',
      'componentWillUpdate',
      'custom:componentWillUpdate',
      'render',
      'custom:render',
      'componentDidUpdate',
      'custom:componentDidUpdate',

      // Update TracedLegacyChild state
      'setState',
      'setState:update fn',
      'custom:setState update fn',
      'shouldComponentUpdate',
      'custom:shouldComponentUpdate',
      'componentWillUpdate',
      'custom:componentWillUpdate',
      'render',
      'custom:render',
      'componentDidUpdate',
      'custom:componentDidUpdate',
      'setState:callback',
      'custom:setState callback',

      // Unmount TracedLegacyChild
      'componentWillUnmount',
      'custom:componentWillUnmount',
    ];

    const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    expect(entries.map((node) => node.textContent))
      .toEqual(formatLogEntries('LegacyChild-1', expectedLogEntries)
    );
  });

  it('logs all legacy UNSAFE_ lifecycle methods', async () => {
    const user = setupUser();
    // Mount TracedLegacyUnsafeChild
    render(<Wrapper renderChild={({prop}) => <TracedLegacyUnsafeChild prop={prop}/>}/>);
    await user.click(screen.getByTestId('prop-value-checkbox')); // Update TracedLegacyUnsafeChild prop
    act(() => jest.runOnlyPendingTimers());

    const expectedLogEntries = [
    // Mount TracedLegacyUnsafeChild
    'constructor',
    'componentWillMount',
    'custom:UNSAFE_componentWillMount',
    'render',
    'componentDidMount',

    // Update TracedLegacyUnsafeChild prop
    'componentWillReceiveProps',
    'custom:UNSAFE_componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'custom:UNSAFE_componentWillUpdate',
    'render',
    'componentDidUpdate',
    ];

    const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    expect(entries.map((node) => node.textContent))
      .toEqual(formatLogEntries('LegacyUnsafeChild-1', expectedLogEntries)
    );
  });

  it('is cleared by clearLog()', () => {
    render(<Wrapper renderChild={() => <TracedChild/>}/>);
    act(() => jest.runOnlyPendingTimers());

    const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    expect(entries).not.toHaveLength(0);

    act(() => clearLog());

    const clearedEntries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    expect(clearedEntries).toHaveLength(0);
  });
});

describe('instanceId counter', () => {
  it('starts at 1', () => {
    render(<Wrapper renderChild={() => <TracedChild/>}/>);
    act(() => jest.runOnlyPendingTimers());

    const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    expect(entries[0]).toHaveTextContent(/^ ?\d+ Child-1/);
  });

  it('increments on remount', async () => {
    const user = setupUser();
    render(<Wrapper renderChild={() => <TracedChild/>}/>);       // Mount TracedChild
    await user.click(screen.getByTestId('show-child-checkbox')); // Unmount TracedChild
    act(() => jest.runOnlyPendingTimers());
    act(() => clearLog());
    await user.click(screen.getByTestId('show-child-checkbox')); // Mount TracedChild
    act(() => jest.runOnlyPendingTimers());

    const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    expect(entries[0]).toHaveTextContent(/^ ?\d+ Child-2/);
  });

  it('is reset by resetInstanceIdCounters', async () => {
    const user = setupUser();
    render(<Wrapper renderChild={() => <TracedChild/>}/>);       // Mount TracedChild
    await user.click(screen.getByTestId('show-child-checkbox')); // Unmount TracedChild
    act(() => jest.runOnlyPendingTimers());
    act(() => clearLog());

    resetInstanceIdCounters();

    await user.click(screen.getByTestId('show-child-checkbox')); // Mount TracedChild
    act(() => jest.runOnlyPendingTimers());

    const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
    expect(entries[0]).toHaveTextContent(/^ ?\d+ Child-1/);
  });
});
