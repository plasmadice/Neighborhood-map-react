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

    onMapClick = (e) => {
        /* 
         *  Triggers when the map is clicked
         *  & the target is not an infowindow
         *  or any of it's children
        */
        let iw = document.querySelector('[style*="cursor: default"]')

        if (this.state.showingInfoWindow && 
            !iw.contains(e.target) &&
            e.target.shape !== 'poly') {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        })
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
            <Map 
                onMapClick={this.onMapClick.bind(this)} 
                google={this.props.google}
                >
                <Marker 
                    position={pos} 
                    onClick={this.onMarkerClick}
                    name={'Dolores park'}/>

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onInfoWindowClose}>
                        <div className="infowindow">
                            <h1>{this.state.selectedPlace.name}</h1>
                        </div>
                </InfoWindow>
            </Map>
        )
    }
}
  
export default GoogleApiComponent({
    apiKey: 'AIzaSyBgc5bIV3ZvAhq0Vrj2K36m2biYLJlat9I'
})(MapContainer)