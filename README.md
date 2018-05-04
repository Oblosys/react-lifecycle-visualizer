# React Lifecycle Visualizer [![npm version](https://badge.fury.io/js/react-lifecycle-visualizer.svg)](https://badge.fury.io/js/react-lifecycle-visualizer)

An npm package ([`react-lifecycle-visualizer`](https://www.npmjs.com/package/react-lifecycle-visualizer)) for tracing & visualizing lifecycle methods of arbitrary React components.

To trace a component, apply the higher-order component `traceLifecycle` to it, and all its lifecycle-method calls will show up in a replayable log component. Additionally, traced components may include a `<this.LifecyclePanel/>` element in their rendering to show a panel with lifecycle methods that are highlighted when the corresponding log entry is selected.

<p align="center">
  <a href="https://stackblitz.com/github/Oblosys/react-lifecycle-visualizer/tree/master/examples/parent-child-demo">
    <img
      alt="Parent-child demo"
      src="https://raw.githubusercontent.com/Oblosys/react-lifecycle-visualizer/master/images/parent-child-demo.gif"
      width="692"
    />
  </a>
</p>

## Usage

The easiest way to get started is to
 open the [StackBlitz project](https://stackblitz.com/github/Oblosys/react-lifecycle-visualizer/tree/master/examples/parent-child-demo?file=src/samples/New.js) and edit the sample components in `src/samples`.

The panel shows the new v16.3 lifecycle methods, unless the component defines at least one legacy method and no new methods. On a component that has both legacy and new methods, React ignores the legacy methods, so the panel shows the new methods.

Though technically not lifecycle methods, `setState` & `render` are also traced. A single `setState(update, [callback])` call may generate up to three log entries:

  1. `'setState'` for the call itself.
  2. If `update` is a function instead of an object, `'setState:update fn'` is logged when that function is evaluated.
  3. If a `callback` function is provided, `'setState:callback'` is logged when it's called.

To save space, the lifecycle panel only contains `setState`, which gets highlighted for any of the three events above.


## Run the demo localy

To run a local copy of the StackBlitz demo, simply clone the repo, and run `npm install` & `npm start`:

```
git clone git@github.com:Oblosys/react-lifecycle-visualizer.git
cd react-lifecycle-visualizer
npm install
npm start
```

The demo runs on http://localhost:8001/.


## Using the npm package

```sh
$ npm i react-lifecycle-visualizer
```

##### Setup

The set up tracing, wrap the root or some other ancestor component in a `<VisualizerProvider>` and include the `<Log/>` component somewhere. For example:

```jsx
import { Log, VisualizerProvider } from 'react-lifecycle-visualizer';

ReactDom.render(
  <VisualizerProvider>
    <div style={{display: 'flex'}}>
      <App/>
      <Log/>
    </div>
  </VisualizerProvider>,
  document.getElementById('root')
);
```

If you're using a WebPack dev-server with hot reloading, you can include a call to `clearInstanceIdCounters` in the module where you set up hot reloading:

```jsx
import { clearInstanceIdCounters } from 'react-lifecycle-visualizer';
..
clearInstanceIdCounters(); // clear instance counters on hot reload
..
```

This isn't strictly necessary, but without it, instance counters will keep increasing on each hot reload, making the log less readable.

#### Trace components

To trace a component (e.g. `ComponentToTrace`,) apply the `traceLifecycle` HOC to it. This is most easily done with a decorator.

```jsx
import { traceLifecycle } from 'react-lifecycle-visualizer';
..
@traceLifecycle
class ComponentToTrace extends React.Component {
  ..
  render() {
    return (
      ..
      <this.LifecyclePanel/>
      ..
    );
  }
}
```

Alternatively, apply `traceLifeCycle` directly to the class, like this:

```jsx
const ComponentToTrace = traceLifeCycle(class ComponentToTrace extends React.Component {...});
```

or

```jsx
class ComponentToTraceOrg extends React.Component {...}
const ComponentToTrace = traceLifeCycle(ComponentToTraceOrg);
```

A `this.trace` method gets added to component and can be used to log specific information:

```jsx
componentDidUpdate(prevProps, prevState) {
  this.trace('prevProps: ' + JSON.stringify(prevProps));
}
```

Because we cannot use `this` to refer to the component instance in the static `getDerivedStateFromProps`, `trace` is passed as a third parameter to this method:

```jsx
static getDerivedStateFromProps(nextProps, prevState, trace) {
    trace('nextProps: ' + JSON.stringify(nextProps));
    ..
}
```


<!-- ## API

### `VisualizerProvider`

Wrap component tree in this. similar to redux

### `traceLifecycle`

 either dec.


### `Log`

### `clearLog`

### `clearInstanceIdCounters`

 -->
