import React from 'react';
import { ErrorBoundary } from 'components/error-boundary/error-boundary';
import Page from 'routers/index';
import './App.scss';
import './theme.less';
import 'assets/icons/index';

const App: React.FC = () => {
  return (
    <div className="App">
      <ErrorBoundary>
        <Page />
      </ErrorBoundary>
    </div>
  );
}

export default App;
