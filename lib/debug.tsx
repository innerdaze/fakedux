import * as React from 'react';

function onRenderCallback(
  id: string, // the "id" prop of the Profiler tree that has just committed
  phase: 'mount' | 'update', // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration: number, // time spent rendering the committed update
  baseDuration: number, // estimated time to render the entire subtree without memoization
  startTime: number, // when React began rendering this update
  commitTime: number, // when React committed this update
  interactions: Set<unknown> // the Set of interactions belonging to this update
) {
  !id.startsWith('StateTrigger') && console.log(id, phase);
}

interface MountCountWrapperProps {
  id: string;
  children: React.ReactNode | React.ReactNode;
}

export const MountCountWrapper = React.memo(
  ({ id, children }: MountCountWrapperProps) => {
    const count = React.useRef(0);

    return (
      <React.Profiler id={id} onRender={onRenderCallback}>
        <p>
          [{id}] Renders: {++count.current}
        </p>
        {children}
      </React.Profiler>
    );
  }
);
