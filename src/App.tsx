import React from 'react';
import Page from 'routers/index';
import './App.scss';
import './theme.less';
import 'assets/icons/index';

const App: React.FC = () => {
  return (
    <div className="App">
      <Page />
    </div>
  );
}

export default App;
