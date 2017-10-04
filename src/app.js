import React, { Component } from 'react';
import './app.css';
import Car from './carstatus/index';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Car></Car>
        <div className="footer">
          <a href="https://www.vexels.com/vectors/preview/145078/red-suv-illustration" target="_blank" rel="noopener noreferrer"> Red suv illustration </a> | designed by Vexels
          <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener noreferrer">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></div>
        </div>
      </div>
    );
  }
}

export default App;
