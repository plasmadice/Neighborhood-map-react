import React, { Component } from 'react'
import GoogleApiComponent from './GoogleApiComponent';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {}
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        })
        console.log(this.state)
    }

    onMapClick = () => {
        console.log('Map clicked')
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          });
        }
    }

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
                <Map 
                    google={this.props.google}
                    onClick={this.onMapClick}>
                    <Marker 
                        position={pos} 
                        onClick={this.onMarkerClick}
                        name={'Dolores park'}/>

                    <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                        <div>
                            <h1>{this.state.selectedPlace.name}</h1>
                        </div>
                    </InfoWindow>
                </Map>
            </div>
        )
    }
}
  
export default GoogleApiComponent({
    apiKey: 'AIzaSyBgc5bIV3ZvAhq0Vrj2K36m2biYLJlat9I'
})(MapContainer)