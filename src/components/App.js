import React, { Component } from 'react';
import MapContainer from './MapContainer';

class App extends Component {
  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }

    return (
      <div className="App" style={style}>
        <MapContainer />
      </div>
    );
  }
}

export default App;
