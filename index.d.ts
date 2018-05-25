import * as React from 'react';

export function clearLog(): void;

export function resetInstanceIdCounters(): void;

export class VisualizerProvider extends React.Component<{}, {}> {}

export class Log extends React.Component<{}, {}> {}

export interface TraceProps {
  trace: (msg: string) => void,
  LifecyclePanel : React.SFC
}

// Diff / Omit from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Diff<T extends string, U extends string> =
  ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// Simpler TypeScript 2.8+ definition of Omit (disabled for now to support lower TypeScript versions)
// export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export function traceLifecycle<P extends TraceProps>(
  component: React.ComponentClass<P>
): React.ComponentClass<Omit<P, keyof TraceProps>>;
