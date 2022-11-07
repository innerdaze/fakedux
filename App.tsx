import * as React from 'react';
import { Store } from './lib/createStore';
import { createSelector, useSelector } from './lib/selectors';
import { StoreType } from './store';
// import { StoreProvider, useUpdateStore } from './store';
import './style.css';

// UTILS

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

const MountCountWrapper = React.memo(
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

interface StateTriggerProps {
  id: string;
}

const StateTrigger = ({ id }: StateTriggerProps) => {
  const [clicks, setClicks] = React.useState(0);

  const handleClicks = React.useCallback(() => {
    setClicks(clicks + 1);
  }, [clicks]);

  return (
    <MountCountWrapper id={`StateTrigger:${id}`}>
      <p>
        [{id}] Clicks: {clicks}
      </p>
      <button onClick={handleClicks}>[{id}] Click me!</button>
    </MountCountWrapper>
  );
};

const StoreTrigger = ({ id }: StateTriggerProps) => {
  // const { update } = useUpdateStore();
  const [clicks, setClicks] = useSelector<number>(clicksSelector);

  const handleClicks = React.useCallback(() => {
    setClicks((prev) => ({
      ...prev,
      actions: { ...prev.actions, clicks: prev.actions.clicks + 1 },
    }));
  }, [clicks]);

  return (
    <MountCountWrapper id={`StateTrigger:${id}`}>
      <p>{`[${id}] Clicks: ${clicks}`}</p>
      <button onClick={handleClicks}>[{id}] Click me!</button>
    </MountCountWrapper>
  );
};

// PLAYGROUND

const metaStatusSelector = createSelector<StoreType>(
  (state) => state.meta.status
);
const clicksSelector = createSelector<StoreType>(
  (state) => state.actions.clicks
);

const FirstComponent = React.memo(() => {
  const [metaStatus] = useSelector<string>(metaStatusSelector);

  return (
    <div style={{ backgroundColor: 'cyan' }}>
      <MountCountWrapper id="FirstComponent">
        <p>[State] Meta Status: {metaStatus}</p>
        <StateTrigger id="First State" />

        <SecondComponent />
      </MountCountWrapper>
    </div>
  );
});

const SecondComponent = React.memo(() => {
  const [metaStatus] = useSelector<string>(metaStatusSelector);

  return (
    <div style={{ backgroundColor: 'magenta' }}>
      <MountCountWrapper id="SecondComponent">
        <StateTrigger id="Second State" />
        <StoreTrigger id="Second Store" />

        <p>[State] Meta Status: {metaStatus}</p>
      </MountCountWrapper>
    </div>
  );
});

export default function App() {
  return (
    <div style={{ backgroundColor: 'yellow' }}>
      <MountCountWrapper id="App">
        <StateTrigger id="App State" />
        <StoreTrigger id="App Store" />
        <FirstComponent />
      </MountCountWrapper>
    </div>
  );
}
