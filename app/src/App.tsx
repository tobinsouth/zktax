import React from 'react';
import Sign from './Sign';
import Prove from './Prove';
import Verify from './Verify';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1>JSON Signing and Proving</h1>
      <div className="app-content">
        <Sign />
        <hr />
        <Prove />
		<hr />
		<Verify />
      </div>
    </div>
  );
};

export default App;
