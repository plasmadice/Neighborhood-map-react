import React, { Component } from 'react';
import MapContainer from './MapContainer';
import Menu from './Menu';
import './App.css';

class App extends Component {
    markerControl = (id) => {
        console.log(id);
    }

    render() {

        return (
            <div className="wrapper" role='main'>
              <MapContainer />
            </div>
        );
    }
}

export default App;
