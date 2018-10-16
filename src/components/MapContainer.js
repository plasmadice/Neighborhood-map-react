import React, { Component } from 'react'
import GoogleApiComponent from './GoogleApiComponent';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';
import { locations } from '../data/locations';
import { auth } from '../data/auth';

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        venueInfo: {}
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
        this.fetchVenueInfo(props.id);

        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        })


        
    }

    fetchVenueInfo = (venueId) => {
        // // Foursquare api fetch
        fetch(`https://api.foursquare.com/v2/venues/${venueId}` +
            `?client_id=${auth.FS_CLIENT_ID}` +
            `&client_secret=${auth.FS_CLIENT_SECRET}` +
            `&v=20181014`).then(res => res.json()).then(venue => {
                this.setState({
                    venueInfo: venue.response.venue
                })
        }).then(() => {
            let iw = document.querySelector('.gm-style-iw');
        
            iw.classList.add('infowindow');
            
            // Target parent of infowindow to remove white border
            iw.parentElement
                .querySelector('div')
                .className='infowindow-parent';
        })
    }

    generateInfoWindowContents = () => {
        const { 
            name,
            attributes,
            bestPhoto,
            location,
            rating,
            likes,
            canonicalUrl
          } = this.state.venueInfo;

        const priceTier = attributes.groups[0].summary;

        return;
    }



    render() {
        console.log(this.state.venueInfo)
        const venue = this.state.venueInfo;
        
        return (
            <Map 
                onMapClick={this.onMapClick.bind(this)} 
                google={this.props.google}
                >
                {
                    locations.map(venue => {
                        return (
                            <Marker 
                                key={venue.venueId}
                                id={venue.venueId}
                                position={{lat: venue.location.lat, lng: venue.location.lng}}
                                onClick={this.onMarkerClick}
                                name={venue.name}
                            />
                        )
                    })
                }

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onInfoWindowClose}>
                        <div className='infowindow-inside-container'>
                            <div className='infowindow-icon'>
                                {/* <img src={`https://igx.4sqi.net/img/general/40x40${this.state.venueInfo.bestPhoto.suffix}`} alt='' /> */}
                            </div>
                            <div className='infowindow-details'>
                                <div className='infowindow-name'> <a href={venue.canonicalUrl} target='_blank'>{venue.name}</a></div>
                                <div className='infowindow-address-data'>
                                    <div className='infowindow-address'>
                                        Somewhere in Miami
                                    </div>
                                    <div>
                                        {/* {venue.contact.formattedPhone} */}
                                    </div>
                                    <p>
                                        {venue.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                </InfoWindow>
            </Map>
        )
    }
}
  
export default GoogleApiComponent({
    apiKey: auth.GOOGLE_MAPS_API_KEY
})(MapContainer)