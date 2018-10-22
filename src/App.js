import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';

class App extends Component {
    render() {
        return (
            <div role='application'>
                <Map />
            </div>
        );
    }
}

export default App;