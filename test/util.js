import { prettyDOM, screen } from '@testing-library/react';

const showLabel = (label) => (label ? ` (${label})` : '');

// Console-log all log entries for debugging.
export const debugShowLogEntries = (label) => {
  const entries = [...screen.getByTestId('log-entries').querySelectorAll('.entry')];
  // eslint-disable-next-line no-console
  console.log(`log entries${showLabel(label)}:`, entries.map((node) => node.textContent));
};

// Console-log all lifecycle-panel method names for debugging.
export const debugShowPanelMethods = (label) => {
  const entries = [...screen.getByTestId('lifecycle-panel').querySelectorAll('.lifecycle-method')];
  // eslint-disable-next-line no-console
  console.log(`panel methods${showLabel(label)}:`, entries.map((node) => node.textContent));
};

// Console-log log-entries DOM.
export const debugShowLogEntriesDom = (label) => {
  // eslint-disable-next-line no-console
  console.log(`Log-entries DOM${showLabel(label)}:`, prettyDOM(screen.getByTestId('log-entries')));
};

// Console-log lifecycle-panel DOM.
export const debugShowLifecyclePanelDom = (label) => {
  // eslint-disable-next-line no-console
  console.log(`Lifecycle panel DOM${showLabel(label)}:`, prettyDOM(screen.getByTestId('lifecycle-panel')));
};
