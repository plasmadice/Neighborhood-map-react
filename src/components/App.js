import React, { Component } from 'react';
import MapContainer from './MapContainer';
import Menu from './Menu';
import './App.css';

class App extends Component {
    render() {

        return (
            <div className="wrapper" role='main'>
              <Menu />
              <MapContainer />
            </div>
        );
    }
}

export default App;
