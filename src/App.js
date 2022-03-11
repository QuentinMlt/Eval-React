import React, { Fragment } from 'react';
import './App.css';

import Calendar from './components/Calendar';

function App() {
  return (
    <Fragment>
      <br/>
      <div className="container has-text-centered">
        <Calendar />
      </div>
    </Fragment>
  );
}

export default App;
