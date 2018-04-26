# React Lifecycle Visualizer [![npm version](https://badge.fury.io/js/react-lifecycle-visualizer.svg)](https://badge.fury.io/js/react-lifecycle-visualizer)

An npm package ([`react-lifecycle-visualizer`](https://www.npmjs.com/package/react-lifecycle-visualizer)) for tracing & visualizing lifecycle methods on arbitrary React components.

A component can be traced by applying a higher-order component `traceLifecycle`, after which all calls to its lifecycle methods show up in a replayable log component. Additionally, traced components may include a `<this.LifecyclePanel/>` element in their rendering to show a list of lifecycle methods that are highlighted when the corresponding log entry is highlighted.

<p align="center">
  <a href="https://stackblitz.com/github/Oblosys/react-lifecycle-visualizer/tree/master/examples/parent-child-demo">
    <!-- <img alt="react-lifecycle-visualizer" src="https://raw.githubusercontent.com/Oblosys/react-lifecycle-visualizer/master/images/parent-child-demo.gif" width="706"> -->
    <img alt="parent-child-demo" src="images/parent-child-demo.gif" width="692">
  </a>
</p>

## Usage

The easiest way to get started is to
 fork the [StackBlitz project](https://stackblitz.com/github/Oblosys/react-lifecycle-visualizer/tree/master/examples/parent-child-demo?file=src/samples/New.js) and edit the sample components in `src/samples`.
