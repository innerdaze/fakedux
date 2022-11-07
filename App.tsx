import * as React from 'react';
import { createSelector } from './lib/fakedux';
import { StoreType, useSelector } from './store';
// import { StoreProvider, useUpdateStore } from './store';
import './style.css';
import { MountCountWrapper } from './lib/debug';

// UTILS
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
  const [clicks, setClicks] = useSelector(clicksSelector);

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

// DEMO
const metaStatusSelector = createSelector(
  (state: StoreType) => state.meta.status
);

const clicksSelector = createSelector(
  (state: StoreType) => state.actions.clicks
);

const FirstComponent = React.memo(() => {
  const [metaStatus] = useSelector(metaStatusSelector);

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
  const [metaStatus] = useSelector(metaStatusSelector);

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
