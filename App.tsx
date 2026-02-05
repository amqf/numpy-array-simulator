import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Simulator from './components/Simulator';

const App: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isSimulating) {
    return <LandingPage onStart={() => setIsSimulating(true)} />;
  }

  return <Simulator />;
};

export default App;