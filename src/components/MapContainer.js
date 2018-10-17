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
        venueInfo: {},
        infoWindowContents: ''
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
            // Remove white border and shadow from default infowindows
            // Removal is done via InfoWindow.css
            let iw = document.querySelector('.gm-style-iw');
            iw.classList.add('infowindow');

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
            canonicalUrl,
            contact,
            description,
          } = this.state.venueInfo;

        const priceTier = attributes.groups[0].summary;

        let iwContents = (
            <div className='infowindow-inside-container'>
                <div className='infowindow-icon'>
                    <img src={`https://igx.4sqi.net/img/general/40x40${bestPhoto.suffix}`} alt='' />
                    <div>{priceTier}</div>
                </div>
                <div className='infowindow-details'>
                    <div className='infowindow-name'>
                        <a href={canonicalUrl} target={'_blank'}>{name}</a>
                        <div>{rating}</div>
                    </div>
                    <div className='infowindow-address-data'>
                        <div className='infowindow-address'>
                            {location.address}
                        </div>
                        <div>
                            {contact.phone}
                        </div>
                        <p>
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        );

        this.setState({ infoWindowContents: iwContents})
    }

    componentDidUpdate = (prevProps, prevState) => {
        console.log(this.state.venueInfo.name !== undefined && 
            this.state.infoWindowContents === '');
        console.log((this.state.activeMarker !== prevState.activeMarker) &&
        this.state.infoWindowContents !== '')
        if (this.state.venueInfo.name !== undefined && 
            this.state.infoWindowContents === '') {
            this.generateInfoWindowContents();
        }
        if ((this.state.activeMarker !== prevState.activeMarker) &&
            this.state.infoWindowContents !== '') {
            if (this.state.venueInfo.id !== prevState.venueInfo.id) {
                this.generateInfoWindowContents();
            }
        }
    }

    render() {
        console.log(this.state.venueInfo)
        
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
                    {this.state.showingInfoWindow &&
                        this.state.infoWindowContents
                    }
                </InfoWindow>
            </Map>
        )
    }
}
  
export default GoogleApiComponent({
    apiKey: auth.GOOGLE_MAPS_API_KEY
})(MapContainer)