import React, { Component } from 'react'
import GoogleApiComponent from './GoogleApiComponent';
import Map from './Map';
import Marker from './Marker';

export class MapContainer extends Component {
    render() {
        const style = {
            width: '100%',
            height: '100%',
        }
        
        const pos = {        
            lat: 25.7705359,
            lng: -80.1896106
        };

        return (
            <div style={style}>
                <Map google={this.props.google}>
                    <Marker />
                    <Marker position={pos} />
                </Map>
            </div>
        )
    }
}
  
export default GoogleApiComponent({
    apiKey: 'AIzaSyBgc5bIV3ZvAhq0Vrj2K36m2biYLJlat9I'
})(MapContainer)