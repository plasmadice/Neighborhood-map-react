import React, { Component } from 'react';
import Menu from './Menu';
import { styles } from '../data/styles.js';
import { locations } from '../data/locations';
import { auth } from '../data/auth';
import './Map.css';

class Map extends Component {
    state = {
        map: {},
        center: {},
        infowindow: {},
        markers: [],
        mapMarkers: [],
        defaultIcon: {},
        highlightedIcon: {}
    }

    initMap = (center) => {
        return new window.google.maps.Map(document.getElementById('map'), {
            center: center.location,
            zoom: 13,
            styles: styles
        })
    }

    hideMarkers = (mapMarkers) => {
        mapMarkers.forEach((mapMarker) => {
            mapMarker.setMap(null);
        })
    }

    addMarkers = (map, markers, infowindow) => {

        // Colors for the default markers
        const defaultIcon = this.makeMarkerIcon('ea4335,960a0a');

        // Color for when the user highlights over the icon or listing
        const highlightedIcon = this.makeMarkerIcon('7289da,ffffff');

        let mapMarkers = []

        markers.forEach((marker) => {
            /*
             * Stores this for later use, necessars because
             * 'this' changes inside of some of these functions
            */
            const this1 = this;

            let newMarker = new window.google.maps.Marker({
                position: marker.location,
                map: map,
                name: marker.name,
                id: marker.venueId,
                url: marker.url,
                icon: defaultIcon
            })

            mapMarkers.push(newMarker);

            // Add eventlistener that generates the infowindow on click
            newMarker.addListener('click', function () {
                this1.populateInfoWindow(newMarker, infowindow, map);
            })

            /*
             * Adds two listeners, one for mouseover, one for mouseout.
             * Effectively creates a toggle for the colors
             */
            newMarker.addListener('mouseover', function () {
                this.setIcon(highlightedIcon);
            })

            newMarker.addListener('mouseout', function () {
                this.setIcon(defaultIcon);
            })

        })

        this.setState({
            mapMarkers: mapMarkers,
            defaultIcon: defaultIcon,
            highlightedIcon: highlightedIcon
        });

    }

    makeMarkerIcon = (markerColor) => {
        let image = {
            url: 'https://www.google.com/maps/vt/icon/name=assets/icons/spotlight/' +
                'spotlight_pin_v2_shadow-1-small.png,assets/icons/spotlight/' +
                'spotlight_pin_v2-1-small.png,assets/icons/spotlight/spotlight_pin_v2_dot-1-small.png,assets/' +
                'icons/spotlight/spotlight_pin_v2_accent-1-small.png&highlight=ff000000,' +
                `${markerColor},ff000000&color=ff000000?scale=2`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(13, 42),
            scaledSize: new window.google.maps.Size(26, 44)
        }

        return image;
    }

    // Foursquare api fetch
    fetchVenueInfo = (marker, infowindow, map) => {
        fetch(`https://api.foursquare.com/v2/venues/${marker.id}` +
            `?client_id=${auth.FS_CLIENT_ID}` +
            `&client_secret=${auth.FS_CLIENT_SECRET}` +
            `&v=20181014`).then(res => res.json()).then(venue => {
                // generate html for infowindow
                this.setInfoWindowContent(marker, infowindow, map, venue.response.venue);
            }).then(() => {
                /*
                * Remove white border and shadow from default maps infowindows
                * Must be done AFTER the infowindow renders
                 */
                let iw = document.querySelector('.gm-style-iw');
                iw.classList.add('infowindow');

                iw.parentElement
                    .querySelector('div')
                    .className = 'infowindow-parent';
            })
    }

    // populates this.infowindow and empties it when done
    setInfoWindowContent = (marker, infowindow, map, venue) => {
        // Create infowindow contents and set it to the infowindow obj
        let contents = this.generateInfoWindowContents(venue);
        infowindow.marker = marker;

        infowindow.setContent(contents);
        infowindow.open(map, marker);

        // clears infowindow object on close
        infowindow.addListener('closeclick', () => infowindow.marker = null)
    }

    // formats venue info into html and returns it to setInfoWindow
    generateInfoWindowContents = (venue) => {
        const { name, bestPhoto, location, rating, contact,
            description, hours, canonicalUrl, url } = venue;

        return `
            <div class='infowindow-inside-container'>
                <div class='infowindow-details'>
                    <div class='infowindow-name'>
                        <a href=${url} target='_blank'>${name}</a>
                        <div class='infowindow-icon'>
                            <img src='https://igx.4sqi.net/img/general/80x80${bestPhoto.suffix}' 
                            alt='${name} restaurant logo' />
                        </div>
                        <div class='infowindow-rating'>${rating}/10</div>
                    </div>
                    <div class='hours'>${hours.status}</div>
                    <div class='infowindow-address-data'>
                        <div class='infowindow-address'>
                            ${location.address}
                        </div>
                        <div class='infowindow-phone'>
                            ${contact.formattedPhone}
                        </div>
                    </div>
                    <div class='infowindow-description-container'>
                        ${description === undefined ? '' : `<p class='restaurant-description'>${description}</p>`}
                        <a class='restaurant-url' href=${canonicalUrl} target='_blank'>Click here for more information</a>
                    </div>
                </div>
            </div>
        `;
    }

    /* 
     * Populates the infowindow when a marker is clicked and only allows
     * for one infowindow at a time. Spawns at the marker's location
    */
    populateInfoWindow = (marker, infowindow, map) => {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker !== marker) {
            this.fetchVenueInfo(marker, infowindow, map);
        }
    }

    initSetup = () => {
        // hard coded center location.
        const initialCenter = {
            title: 'Miami',
            location: {
                lat: 25.7677804,
                lng: -80.213187,
            }
        }

        let map = this.initMap(initialCenter)
        let infowindow = new window.google.maps.InfoWindow({ maxWidth: 200 })
        this.addMarkers(map, locations, infowindow)
        this.setState({
            map: map,
            markers: locations,
            center: initialCenter,
            infowindow: infowindow
        })
    }

    componentDidMount() {
        window.initSetup = this.initSetup;
        loadMapAsync('https://maps.googleapis.com/maps/api/js?' +
            'key=AIzaSyBvM-jU8M1YuK6iAwA-Eh94FskaD-VHFis&v=3&callback=initSetup')
    }

    render() {
        const { map, markers, mapMarkers, infowindow,
            defaultIcon, highlightedIcon } = this.state

        return (
            <div>
                <Menu
                    map={map}
                    infowindow={infowindow}
                    markers={markers}
                    mapMarkers={mapMarkers}
                    defaultIcon={defaultIcon}
                    highlightedIcon={highlightedIcon}
                    addMarkers={this.addMarkers}
                    hideMarkers={this.hideMarkers}
                    populateInfoWindow={this.populateInfoWindow}
                />
                <div id='map' className='map' role='application' tabIndex='-1'
                    aria-labelledby="aria-map-description" aria-hidden="true"></div>
                <label id="aria-map-description" className="aria-labels">
                    map user interface
            </label>
            </div>
        )
    }
}

export default Map;

// load Google map asynchronously
function loadMapAsync(src) {
    var s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = src
    s.onerror = () => {
        alert('Google Map API can not be loaded.')
    }
    var x = document.getElementsByTagName('script')[0]
    x.parentNode.insertBefore(s, x)
}
