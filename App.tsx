import React from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import { StartScreen } from './screens/StartScreen';
import { ActiveTripScreen } from './screens/ActiveTripScreen';
import { SummaryScreen } from './screens/SummaryScreen';

const Main: React.FC = () => {
  const { status } = useTrip();

  switch (status) {
    case 'START':
      return <StartScreen />;
    case 'ACTIVE':
      return <ActiveTripScreen />;
    case 'SUMMARY':
      return <SummaryScreen />;
    default:
      return <StartScreen />;
  }
};

const App: React.FC = () => {
  return (
    <TripProvider>
      <Main />
    </TripProvider>
  );
};

export default App;
