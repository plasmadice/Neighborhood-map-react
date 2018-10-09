import React, { Component } from 'react'
import GoogleApiComponent from './GoogleApiComponent';
import Map from './Map';

export class MapContainer extends Component {
    render() {
        const style = {
            width: '100%',
            height: '100%',
        }

        return (
            <div style={style}>
                <Map google={this.props.google} />
            </div>
        )
    }
}
  
export default GoogleApiComponent({
    apiKey: 'AIzaSyBgc5bIV3ZvAhq0Vrj2K36m2biYLJlat9I'
})(MapContainer)