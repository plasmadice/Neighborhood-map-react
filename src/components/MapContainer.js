import React, { Component } from 'react'
import GoogleApiComponent from './GoogleApiComponent';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';
import { locations } from '../data/locations';
import { auth } from '../data/auth';
import Menu from './Menu';

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        markerList: [],
        activeMarker: {},
        venueInfo: {},
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
            activeMarker: marker,
            showingInfoWindow: true
        })        
    }

    // Grabs marker from <Marker /> and stores them in state
    markerControl = (marker) => {
        if (!this.state.markerList.length) {
            this.setState((prevState) => {
                const newMarkerList = prevState.markerList
                newMarkerList.push(marker);
                return { markerList: newMarkerList}
            })
        }
    }

    fetchVenueInfo = (venueId) => {
        // // Foursquare api fetch
        fetch(`https://api.foursquare.com/v2/venues/${venueId}` +
            `?client_id=${auth.FS_CLIENT_ID}` +
            `&client_secret=${auth.FS_CLIENT_SECRET}` +
            `&v=20181014`).then(res => res.json()).then(venue => {
                // generate html for infowindow
                this.generateInfoWindowContents(venue.response.venue);
                console.log(venue);

                // setState to trigger re-render
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

    generateInfoWindowContents = (venue) => {
        console.log(venue);
        // const { 
        //     name,
        //     attributes,
        //     bestPhoto,
        //     location,
        //     rating,
        //     canonicalUrl,
        //     contact,
        //     description,
        //   } = venue;

        // const priceTier = attributes.groups[0].summary;

        // this.iwContents = (
        //     <div className='infowindow-inside-container'>
        //         <div className='infowindow-icon'>
        //             <img src={`https://igx.4sqi.net/img/general/40x40${bestPhoto.suffix}`} alt='' />
        //             <div>{priceTier}</div>
        //         </div>
        //         <div className='infowindow-details'>
        //             <div className='infowindow-name'>
        //                 <a href={canonicalUrl} target={'_blank'}>{name}</a>
        //                 <div>{rating}</div>
        //             </div>
        //             <div className='infowindow-address-data'>
        //                 <div className='infowindow-address'>
        //                     {location.address}
        //                 </div>
        //                 <div>
        //                     {contact.phone}
        //                 </div>
        //                 <p>
        //                     {description}
        //                 </p>
        //             </div>
        //         </div>
        //     </div>
        // );
    }

    componentDidUpdate = (prevProps, prevState) => {
        console.log(prevProps);
        if (this.state.showingInfoWindow) {
            this.generateInfoWindowContents();
        }
    }

    render() {
        console.log(this.state.venueInfo)
        console.log(this.iwContents)
        
        return (
            <Menu
            >
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
                                    markerControl={this.markerControl}
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
                            this.iwContents
                        }
                    </InfoWindow>
                </Map>
            </Menu>
        )
    }
}
  
export default GoogleApiComponent({
    apiKey: auth.GOOGLE_MAPS_API_KEY
})(MapContainer)