import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import "./theme/bootstrap.min.css"
import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    {/* <div class='ripple-background'>
      <div class='hexagon xxlarge shade1'></div>
      <div class='hexagon xlarge shade2'></div>
      <div class='hexagon large shade3'></div>
      <div class='hexagon mediun shade4'></div>
      <div class='hexagon small shade5'></div>
  </div> */}
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);